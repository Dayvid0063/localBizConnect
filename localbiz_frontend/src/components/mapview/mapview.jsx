import React, { useEffect, useState } from "react";
import { StarRating } from "star-ratings-react";
import { useAuth } from "../context/AuthenticationContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { reviewApiRequests, configApiRequests } from "../../api";

const MapView = () => {
  const [apiKey, setApiKey] = useState("");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [map, setMap] = useState(null);
  const { isLoggedIn, user } = useAuth();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [infoWindow, setInfoWindow] = useState(null);
  const [infoPane, setInfoPane] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const userInfo = user?.data?.user;

  useEffect(() => {
    // Fetch API key
    const fetchApiKey = async () => {
      try {
        const keyResponse = await configApiRequests.getAPIkey();
        const key = keyResponse.data.apiKey; // Access the apiKey property from the response object
        setApiKey(key);
      } catch (error) {
        console.error("Error fetching API key:", error);
        // Handle error
      }
    };
  
    fetchApiKey();
  }, []);

  useEffect(() => {
    if (apiKey) {
      // Load Google Maps API script
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        initMap();
      };

      return () => {
        // Cleanup script
        document.body.removeChild(script);
      };
    }
  }, [apiKey]);


  const initMap = () => {
    // Try HTML5 geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          const mapInstance = new window.google.maps.Map(
            document.getElementById("map"),
            {
              center: pos,
              zoom: 16,
            }
          );
          setMap(mapInstance);

          const infoWindowInstance = new window.google.maps.InfoWindow();
          setInfoWindow(infoWindowInstance);

          const infoPaneInstance = document.getElementById("panel");
          setInfoPane(infoPaneInstance);

          // Call Places Nearby Search on the user's location
          getNearbyPlaces(pos);
        },
        () => {
          handleLocationError(true);
        }
      );
    } else {
      // Browser doesn't support geolocation
      handleLocationError(false);
    }
  };

  const handleLocationError = (browserHasGeolocation) => {
    console.error(
      browserHasGeolocation
        ? "Geolocation permissions denied. Using default location."
        : "Error: Your browser doesn't support geolocation."
    );
    // Default location to Lagos if geolocation is not supported or denied
    const pos = { lat: 6.45407, lng: 3.39467 };
    const mapInstance = new window.google.maps.Map(
      document.getElementById("map"),
      {
        center: pos,
        zoom: 15,
      }
    );
    setMap(mapInstance);

    const infoWindowInstance = new window.google.maps.InfoWindow();
    setInfoWindow(infoWindowInstance);

    const infoPaneInstance = document.getElementById("panel");
    setInfoPane(infoPaneInstance);

    // Call Places Nearby Search on the default location
    getNearbyPlaces(pos);
  };

  const getNearbyPlaces = (position) => {
    setLoading(true);
    const request = {
      location: position,
      radius: "1000", // in meters
      keyword: searchQuery || "business", // Use search query if provided, otherwise default to "business"
      type: selectedCategory || undefined, // Only include if a category is selected
    };

    const service = new window.google.maps.places.PlacesService(map);
    service.nearbySearch(request, nearbyCallback);
  };

  const nearbyCallback = (results, status) => {
    setLoading(false);
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      createMarkers(results);
    }
  };

  const createMarkers = (places) => {
    places.forEach((place) => {
      const marker = new window.google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name,
      });

      // Add click listener to each marker
      window.google.maps.event.addListener(marker, "click", () => {
        const request = {
          placeId: place.place_id,
          fields: [
            "name",
            "formatted_address",
            "geometry",
            "rating",
            "website",
            "photos",
            "reviews", // Include reviews in the request
          ],
        };

        // Fetch the details of the place when the user clicks on a marker
        const service = new window.google.maps.places.PlacesService(map);
        service.getDetails(request, (placeResult, status) => {
          showDetails(placeResult, marker, status);
        });
      });

      // Add click listener for each place on the map
      window.google.maps.event.addListener(map, "click", () => {
        // Close the sidebar if a click happens on the map
        setSelectedPlace(null);
      });
    });
  };

  const showDetails = (placeResult, marker, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      setSelectedPlace(placeResult);
    } else {
      console.error("showDetails failed: ", status);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    const pos = map.getCenter(); // Use the current center of the map for search
    getNearbyPlaces(pos);
  };

  const handleViewDirection = () => {
    // Open Google Maps with directions to the selected place
    if (selectedPlace && selectedPlace.geometry) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.geometry.location.lat()},${selectedPlace.geometry.location.lng()}`;
      window.open(url, "_blank");
    }
  };

  const handleLeaveReview = () => {
    if (isLoggedIn) {
      setShowReviewModal(true);
    } else {
      alert("Please log in to leave a review.");
      // Redirect to login page here
      navigate("/login");
    }
  };

  const handleSubmitReview = async (e) => {
    const business_name = selectedPlace.name;
    const business_address = selectedPlace.formatted_address;
    const userId = userInfo._id;
    e.preventDefault();
    const reviewData = {
      businessName: business_name,
      businessAddress: business_address,
      rating,
      comment,
      userId,
    };

    try {
      await reviewApiRequests.createReview(reviewData);
      setShowReviewModal(false);
      toast.success("Review created successfully");
      ///window.location.reload(true);
    } catch (error) {
      toast.error("Error submitting review:", error);
      // Handle error
    }
  };

  return (
    <div>
      <h1>Businesses Map View</h1>
      <div style={{ display: "flex" }}>
        <div
          id="panel"
          style={{
            display: selectedPlace ? "block" : "none",
            flex: 1,
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            overflowY: "auto",
            padding: "20px",
          }}
        >
          {selectedPlace && (
            <>
              <h2>{selectedPlace.name}</h2>
              <p>Rating: {selectedPlace.rating || "None"}</p>
              <p>Address: {selectedPlace.formatted_address}</p>
              <p>Website: {selectedPlace.website || "Not available"}</p>
              {selectedPlace.photos && (
                <img
                  src={selectedPlace.photos[0].getUrl()}
                  alt={selectedPlace.name}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              )}
              <button
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  marginRight: "10px",
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
                onClick={handleViewDirection}
              >
                View Directions in Google Maps
              </button>
              <button
                style={{
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
                onClick={handleLeaveReview}
              >
                Leave a Review
              </button>
            </>
          )}
        </div>
        <div style={{ flex: 2, position: "relative" }}>
          {/* Map container */}
          <div id="map" style={{ width: "100%", height: "500px" }}></div>
          {/* Search Bar */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              backgroundColor: "white",
              padding: "10px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              zIndex: 1,
            }}
          >
            <input
              type="text"
              placeholder="Search for businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          {/* Category Filter */}
          <div
            style={{
              position: "absolute",
              top: "70px",
              left: "20px",
              backgroundColor: "white",
              padding: "10px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              zIndex: 1,
            }}
          >
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="restaurant">Restaurants</option>
              <option value="bar">Bars</option>
              <option value="hotel">Hotels</option>
              <option value="cafe">Cafes</option>
              <option value="supermarket">Supermarkets</option>
              {/* Add more categories as needed */}
            </select>
          </div>
          {/* View Direction Button */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              backgroundColor: "white",
              padding: "10px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              zIndex: 1,
            }}
          >
            <button onClick={handleViewDirection}>View Direction</button>
          </div>
        </div>
        {/* Loading indicator */}
        {loading && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              padding: "20px",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              zIndex: 9999,
            }}
          >
            Loading...
          </div>
        )}
      </div>
      {/* Modal for review form */}
      {showReviewModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowReviewModal(false)}>
              &times;
            </span>
            <h2>Leave a Review</h2>
            <form onSubmit={handleSubmitReview}>
              <div>
                <label>Rating:</label>
                <StarRating
                  rating={rating}
                  onSetRating={setRating}
                  maxRating={5}
                />
              </div>
              <div>
                <label>Comment:</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Submit Review</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;

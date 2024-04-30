import "./reviews.scss";
import React, { useState, useEffect } from "react";
import { reviewApiRequests } from "../../api";
import { useAuth } from "../../components/context/AuthenticationContext";
import { IoIosArrowBack } from "react-icons/io"; // Import the back arrow icon from React Icons
import { useNavigate } from "react-router-dom";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const user = useAuth();
  const navigate = useNavigate();

  const userInfo = user?.user?.data?.user;
  const userId = userInfo._id;
  useEffect(() => {
    // Fetch reviews when the component mounts
    const fetchReviews = async () => {
      try {
        const response = await reviewApiRequests.getUserReviews(userId);

        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [userId]);

  return (
    <div className="review-container">
      <div className="back-button" onClick={() => navigate(-1)}>
        <IoIosArrowBack size={20} /> Back
      </div>
      <h2>User Reviews</h2>
      <div className="reviews-list">
        {reviews &&
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <p>Business Name: {review.businessName}</p>
              <p>Business Address: {review.businessAddress}</p>
              <p>Rating: {review.rating}</p>
              <p>Comment: {review.comment}</p>
              {/* You can add more details or styling here */}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Review;

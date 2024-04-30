import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { usersApiRequests } from "../../api";
import { useState } from "react";
import { toast } from "react-toastify";

const New = ({ title }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    phoneNumber: "",
    address: "",
    role: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use the appropriate API request based on the user's role
      formData.role === "admin"
        ? await usersApiRequests.createAdmin(formData)
        : await usersApiRequests.createUser(formData);

      // Handle the response, show success message, update UI, etc.
      toast.success("User Added Successfully");
      // Reset the form by updating the state with initial values
      setFormData({
        name: "",
        email: "",
        password: "",
        businessName: "",
        phoneNumber: "",
        address: "",
        role: "",
      });
    } catch (error) {
      // Handle errors, show error message, etc.
      console.error("Error adding new user:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <div className="formRow">
                  <div className="formColumn">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="formColumn">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="formRow">
                  <div className="formColumn">
                    <label>Password:</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                  <div className="formColumn">
                    <label>Role:</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    />
                  </div>
                </div>
                {/* Add other input fields based on user roles */}
                {/* For example, if the role is 'seller', add a businessName field */}
                {formData.role === "seller" && (
                  <div>
                    <div className="formRow">
                      <div className="formColumn">
                        <label>Business Name:</label>
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              businessName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="formColumn">
                        <label>Phone Number:</label>
                        <input
                          type="text"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phoneNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="formRow">
                      <div className="formColumn">
                        <label>Business Address:</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
                <button type="submit">Add User</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;

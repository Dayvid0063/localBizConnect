import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../../server";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const [activated, setActivated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activation_token) {
      const activationEmail = async () => {
        try {
          const res = await axios.post(
            `${server}/admin/activation/${activation_token}`
          );

          // Check the specific message returned by the server
          if (res.data.success) {
            setActivated(true);
          } else {
            setError(true);
          }
        } catch (error) {
          console.log(error.response.data.message);
          setError(true);
        } finally {
          setLoading(false);
        }
      };

      activationEmail();
    }
  }, [activation_token]);

  if (loading) {
    // Render a loading spinner or any other indication
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Activating...
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {error ? (
        <p>Your activation token expired!</p>
      ) : activated ? (
        <p>Your account has been activated successfully</p>
      ) : (
        <p>Your account has been created successfully</p>
      )}
    </div>
  );
};

export default ActivationPage;

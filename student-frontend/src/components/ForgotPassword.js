import React, { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  // Validate the form
  const validateForm = () => {
    const validationErrors = {};
    if (!email.trim()) {
      validationErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.email = "Invalid email format.";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError("");

    if (validateForm()) {
      try {
        const response = await Axios.post("https://api.example.com/forgot-password", { email });
        console.log(response.data);
        alert("Check your email for the reset password link.");
        navigate("/login");
      } catch (error) {
        console.error(error);
        setServerError("An error occurred while sending the reset link. Please try again later.");
      }
    }
  };

  return (
    <section className="py-5">
      <div className="container text-start">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="p-4 bg-white shadow rounded">
              <h2 className="mb-4 text-center">Forgot Password</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={`form-control ${submitted && errors.email ? "is-invalid" : ""}`}
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {submitted && errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {serverError && (
                  <div className="alert alert-danger" role="alert">
                    {serverError}
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    Send Reset Link
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;

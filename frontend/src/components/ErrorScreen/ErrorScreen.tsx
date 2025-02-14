import React from "react";
import { BsTools } from "react-icons/bs";
import "./ErrorScreen.css";

/**
 * ErrorScreen Component
 *
 * Displays a full-screen error message with a friendly tone.
 * Useful for handling unexpected errors in the application.
 */
const ErrorScreen: React.FC = () => {
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center flex-column z-3 bg-white">
      {/* Error Icon */}
      <BsTools className="error-icon" />

      {/* Main error message */}
      <p className="mt-5 error-title">Oops! Something went wrong.</p>
      
      {/* Additional guidance for the user */}
      <p className="mt-1 error-subtitle">
        Try refreshing the page or try again later.
      </p>
    </div>
  );
};

export default ErrorScreen;

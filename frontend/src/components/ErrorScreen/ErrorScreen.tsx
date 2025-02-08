import React from "react";
import "./ErrorScreen.css";
import { BsTools } from "react-icons/bs";

/**
 * ErrorScreen Component
 * Displays a full-screen error message with a friendly tone.
 */
const ErrorScreen: React.FC = () => {
    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center flex-column z-3 bg-white">
            <BsTools className="error-icon"/>
            <p className="mt-5 error-title">Oops! Something went wrong.</p>
            <p className="mt-1 error-subtitle">Try refreshing the page or try again later.</p>
        </div>
    );
}

export default ErrorScreen;
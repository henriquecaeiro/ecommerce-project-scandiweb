import React from "react";
import "./LoadingScreen.css";
import logo from "../../assets/logo.svg"; 

/**
 * LoadingScreen Component
 * Displays a loading screen with the application logo.
 */
const LoadingScreen: React.FC = () => {
    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center z-3 bg-body-secondary">
            <img src={logo} alt="Loading" className="loader" />
        </div>
    );
};

export default LoadingScreen;

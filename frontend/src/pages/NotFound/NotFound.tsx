import React from "react";
import { Link } from "react-router-dom";
import { TbError404 } from "react-icons/tb";
import { AiFillHome } from "react-icons/ai";
import "./NotFound.css";

/**
 * NotFound Component
 * This component is displayed when a user accesses a route that does not exist.
 * It provides a 404 error message and a link to return to the homepage.
 */
const NotFound: React.FC = () => {
    return (
        <main className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center flex-column z-3 bg-white">
            {/* 404 Error Icon */}
            <TbError404 className="not-found-icon" aria-label="404 Error" />

            {/* Error Message */}
            <p className="mt-1 not-found-title">Oops! Page not found.</p>

            {/* Link to Home Page */}
            <Link to="/" className="not-found-home d-flex" aria-label="Back to Home">
                <AiFillHome className="back-home-icon me-2" />
                <p>Back To Home Page</p>
            </Link>
        </main>
    );
}

export default React.memo(NotFound);
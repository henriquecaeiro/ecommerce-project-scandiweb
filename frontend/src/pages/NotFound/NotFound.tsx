import React from "react";
import "./NotFound.css";
import { TbError404 } from "react-icons/tb";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";

const NotFound: React.FC = () => {

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center flex-column z-3 bg-white">
            <TbError404 className="not-found-icon" />
            <p className="mt-1 not-found-title">Oops! Page not found.</p>
            <Link to="/" className="not-found-home d-flex">
                <AiFillHome className="back-home-icon me-2" /> <p>Back To Home Page</p>
            </Link>
        </div>
    );
}

export default NotFound
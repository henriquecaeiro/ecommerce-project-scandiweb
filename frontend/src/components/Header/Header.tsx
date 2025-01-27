import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../../apollo/queries/categoryQueries";
import { useCategory } from "../../context/CategoryContext";
import "./Header.css";
import { useError } from "../../context/ErrorContext";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import useDelayedLoading from "../../hooks/useDelayedLoading";

interface Category {
    name: string
}

/**
 * Header Component
 * Displays navigation categories fetched from the server.
 * Handles loading states with a 2.5-second delay for a smoother user experience.
 */
const Header: React.FC = () => {
    const { activeItem, setActiveItem } = useCategory();
    const { setError } = useError();
    const { loading, error, data } = useQuery<{ categories: Category[] }>(GET_CATEGORIES);

    // Add a 2.5-second delay for better loading experience
    const showLoading = useDelayedLoading(loading, 2500);

    useEffect(() => {
        // Sets a global error state if the query fails
        if (error) {
            return setError(true)
        }
    }, [error, setError]);

    // Displays a loading screen while fetching categories
    if (showLoading) {
        return <LoadingScreen />
    };

    return (
        <header className="navbar navbar-expand-lg navbar-light bg-light m-0 p-0">
            <div className="container h-100">
                <div className="collapse navbar-collapse h-100" id="navbarNav">
                    <ul className="navbar-nav w-100 align-items-center">
                        {data?.categories.map((category) => (
                            <li
                                key={category.name}
                                className={`nav-item position-relative h-100 ${activeItem === category.name ? "active-item" : ""
                                    }`}
                                onClick={() => setActiveItem(category.name)}
                            >
                                <a
                                    className="nav-link text-uppercase d-flex justify-content-center align-items-center h-100 px-3"
                                    href="#"
                                    data-testid={
                                        activeItem === category.name
                                        ? "active-category-link"
                                        : "category-link"
                                    }
                                >
                                    {category.name}
                                </a>
                                {activeItem === category.name && <span className="active-underline"></span>}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;

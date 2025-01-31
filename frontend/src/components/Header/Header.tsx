import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../../apollo/queries/categoryQueries";
import { useCategory } from "../../context/CategoryContext";
import "./Header.css";
import { useError } from "../../context/ErrorContext";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import useDelayedLoading from "../../hooks/useDelayedLoading";
import logo from "../../assets/logo.svg";
import cart from "../../assets/cart-black.svg";

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

    const [underlineStyle, setUndelineStyle] = useState<{ left: string; width: string, top: string }>({ left: "0px", width: "0px", top: "0px" });
    const activeItemRef = useRef<HTMLAnchorElement | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    // Add a 2.5-second delay for better loading experience
    const showLoading = useDelayedLoading(loading, 2500);

    useEffect(() => {
        // Sets a global error state if the query fails
        if (error) {
            return setError(true)
        }
    }, [error, setError]);

    useEffect(() => {
        window.addEventListener("resize", updateUnderlinePosition);
        return () => window.removeEventListener("resize", updateUnderlinePosition);
    }, [])

    const updateUnderlinePosition = () => {
        if (activeItemRef.current) {
            const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = activeItemRef.current;

            let underlineTop = "80px";

            if (window.innerWidth <= 992) {
                underlineTop = `${offsetTop + offsetHeight + 5}px`;
            }

            setUndelineStyle({ left: `${offsetLeft}px`, width: `${offsetWidth}px`, top: underlineTop })
        }
    };

    useLayoutEffect(() => {
        updateUnderlinePosition();
    }, [activeItem])

    // Displays a loading screen while fetching categories
    if (showLoading) {
        return <LoadingScreen />
    };

    return (
        <nav className="navbar navbar-expand-lg bg-white position-relative p-0">
            <div className="container-fluid d-flex align-items-center">

                {/* Botão do Menu Mobile - Alinhado à Direita */}
                <button
                    className="navbar-toggler me-auto"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup"
                    aria-expanded={isMenuOpen ? "true" : "false"}
                    aria-label="Toggle navigation"
                    onClick={() => setIsMenuOpen(prev => !prev)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Menu de Categorias - Alinhado à Esquerda */}
                <div className="collapse navbar-collapse mobile-menu" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        {data?.categories.map((category, index) => (
                            <Link
                                key={`${category.name}-${index}`}
                                to="/"
                                ref={activeItem === category.name ? activeItemRef : null}
                                className={`nav-link text-uppercase d-flex justify-content-center align-items-center px-3  
                                ${activeItem === category.name ? "active-item" : ""}`}
                                data-testid={activeItem === category.name ? "active-category-link" : "category-link"}
                                onClick={() => setActiveItem(category.name)}
                            >
                                {category.name}
                            </Link>
                        ))}


                        {/* Active Underline */}
                        {activeItem && (
                            <span
                                className={`active-underline position-absolute ${isMenuOpen ? "show" : "hide"}`}
                                style={underlineStyle}
                            ></span>
                        )}
                    </div>
                </div>

                {/* Nome da Marca - Sempre Centralizado */}
                <Link to="/" className="navbar-brand mx-auto position-absolute start-50 translate-middle-x">
                    <img src={logo} alt="logo" />
                </Link>

                <img src={cart} alt="cart"  className="shopping-cart"/>
            </div>
        </nav>
    );
};

export default Header;

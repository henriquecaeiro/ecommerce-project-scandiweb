import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import logo from "../../assets/logo.svg";
import cart from "../../assets/cart-black.svg";
import "./Header.css";
import { useCategory } from "../../context/CategoryContext";
import { useError } from "../../context/ErrorContext";
import { useCart } from "../../context/CartContext";
import useDelayedLoading from "../../hooks/useDelayedLoading";
import { GET_CATEGORIES } from "../../apollo/queries/categoryQueries";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { Category } from "../../interfaces/Category";

/**
 * Header Component
 *
 * Displays navigation categories fetched via GraphQL, along with the logo
 * and shopping cart icon (with cart quantity). It also manages an animated underline
 * that highlights the active navigation link. The component adjusts for responsive
 * layouts using event listeners.
 */
const Header: React.FC = () => {
  // Retrieve active category state and updater from CategoryContext.
  const { activeItem, setActiveItem } = useCategory();
  // Retrieve cart state from CartContext.
  const { isOpen, setIsOpen, cartItems, cartQuantity, setCartQuantity } = useCart();
  // Retrieve error updater from ErrorContext.
  const { setError } = useError();

  // Query to fetch categories from the GraphQL API.
  const { loading, error, data } = useQuery<{ categories: Category[] }>(GET_CATEGORIES);

  // State for storing the computed underline style (position and dimensions).
  const [underlineStyle, setUnderlineStyle] = useState<{ left: string; width: string; top: string }>({
    left: "0px",
    width: "0px",
    top: "0px",
  });

  // Create a ref to hold the active navigation link DOM element.
  const activeItemRef = useRef<HTMLAnchorElement | null>(null);

  // Local state to control whether the mobile menu is open.
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Custom hook to enforce a minimum loading time (2.5 seconds) for a smoother UX.
  const showLoading = useDelayedLoading(loading, 2500);

  /**
   * updateUnderlinePosition
   *
   * Calculates and sets the position and dimensions of the underline element
   * based on the active navigation link. On mobile (window.innerWidth <= 992),
   * the top position is adjusted using the element's offsetTop and offsetHeight.
   */
  const updateUnderlinePosition = () => {
    if (activeItemRef.current) {
      const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = activeItemRef.current;
      // Default top position is "80px" for desktop
      let underlineTop = "80px";
      // For mobile devices, adjust the top position dynamically
      if (window.innerWidth <= 992) {
        underlineTop = `${offsetTop + offsetHeight + 5}px`;
      }
      setUnderlineStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
        top: underlineTop,
      });
    }
  };

  // When loading is complete and categories are available, initialize the underline position.
  useEffect(() => {
    if (!loading && data?.categories.length && activeItemRef.current) {
      const { offsetLeft, offsetWidth } = activeItemRef.current;
      // Use default top value for initial rendering
      let underlineTop = "80px";
      setUnderlineStyle({ left: `${offsetLeft}px`, width: `${offsetWidth}px`, top: underlineTop });
    }
  }, [showLoading]);

  // Set the default active category to the first category when data loads.
  // Also, add a resize event listener to update the underline position on window resize.
  useEffect(() => {
    if (data?.categories.length && !activeItem) {
      setActiveItem(data.categories[0].name);
    }
    const handleResize = () => {
      updateUnderlinePosition();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data, activeItem, setActiveItem]);

  // If there is an error during the category fetch, update the error state.
  useEffect(() => {
    if (error) {
      setError(true);
    }
  }, [error, setError]);

  // Update the cart quantity whenever the cartItems array changes.
  useEffect(() => {
    const totalQuantity = cartItems.reduce((acc, product) => acc + product.quantity, 0);
    setCartQuantity(totalQuantity);
  }, [cartItems]);

  // Update underline position when the mobile menu open state changes.
  useEffect(() => {
    updateUnderlinePosition();
  }, [isMenuOpen]);

  // Recalculate underline position after the active category changes.
  useLayoutEffect(() => {
    updateUnderlinePosition();
  }, [activeItem]);

  // If still loading, render the LoadingScreen component.
  if (showLoading) {
    return <LoadingScreen />;
  }

  return (
    <nav className="navbar navbar-expand-lg bg-white position-relative p-0 z-3">
      <div className="container-fluid">
        {/* Mobile Menu Toggler */}
        <button
          className="navbar-toggler me-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded={isMenuOpen ? "true" : "false"}
          aria-label="Toggle navigation"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse mobile-menu" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            {data?.categories.map((category, index) => (
              <Link
                key={`${category.name}-${index}`}
                to={`/${category.name.toLowerCase()}`}
                ref={activeItem === category.name ? activeItemRef : null}
                className={`nav-link text-uppercase d-flex justify-content-center align-items-center px-3 ${
                  activeItem === category.name ? "active-item" : ""
                }`}
                data-testid={activeItem === category.name ? "active-category-link" : "category-link"}
                onClick={() => setActiveItem(category.name)}
              >
                {category.name}
              </Link>
            ))}
            {/* Underline element that visually indicates the active navigation link */}
            {activeItem && (
              <span
                className={`active-underline position-absolute ${isMenuOpen ? "show" : "hide"}`}
                style={underlineStyle}
              ></span>
            )}
          </div>
        </div>

        {/* Logo centered in the header */}
        <Link to="/" className="navbar-brand mx-auto position-absolute start-50 translate-middle-x">
          <img src={logo} alt="logo" />
        </Link>

        {/* Shopping Cart Icon */}
        <div className="shopping-cart-container position-relative">
          <img
            src={cart}
            alt="cart"
            className="shopping-cart"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="cart-btn"
          />
          {(isOpen && cartQuantity > 0 ) && (
            <div className="quantity-button position-absolute bottom-50 start-50 d-flex justify-content-center align-items-start">
              <span className="quantity-text">{cartQuantity}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
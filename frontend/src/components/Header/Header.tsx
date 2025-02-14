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
 * Displays navigation categories fetched from the server.
 * Handles loading states with a delay for a smoother user experience.
 * Also displays the logo and the shopping cart icon with the current cart quantity.
 */
const Header: React.FC = () => {
  // Get active category and updater from CategoryContext.
  const { activeItem, setActiveItem } = useCategory();
  // Access cart-related state from CartContext.
  const { isOpen, setIsOpen, cartItems } = useCart();
  // Access error updater from ErrorContext.
  const { setError } = useError();

  // Fetch categories from GraphQL.
  const { loading, error, data } = useQuery<{ categories: Category[] }>(GET_CATEGORIES);

  // State to store the style (position and dimensions) for the active underline.
  const [underlineStyle, setUnderlineStyle] = useState<{ left: string; width: string; top: string }>({
    left: "0px",
    width: "0px",
    top: "0px", 
  });

  // Create a ref to hold the active navigation link element.
  const activeItemRef = useRef<HTMLAnchorElement | null>(null);
  // Local state for controlling the mobile menu open/closed.
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  // Local state for the total quantity of items in the cart.
  const [cartQuantity, setCartQuantity] = useState<number>(0);

  // Use a custom hook to ensure the loading indicator shows for at least 2.5 seconds.
  const showLoading = useDelayedLoading(loading, 2500);

  /**
   * updateUnderlinePosition
   * Calculates and sets the underline's position and width based on the active item.
   * For mobile (width <= 992px), it uses the element's offsetTop plus offsetHeight plus a small margin.
   * Otherwise, a default top value of "80px" is used.
   */
  const updateUnderlinePosition = () => {
    if (activeItemRef.current) {
      const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = activeItemRef.current;
      let underlineTop = "80px";
      if (window.innerWidth <= 992) {
        underlineTop = `${offsetTop + offsetHeight + 5}px`;
      }
      setUnderlineStyle({ left: `${offsetLeft}px`, width: `${offsetWidth}px`, top: underlineTop });
    }
  };

  // When loading is finished and categories are loaded, update the underline style.
  useEffect(() => {
    if (!loading && data?.categories.length && activeItemRef.current) {
      const { offsetLeft, offsetWidth } = activeItemRef.current;
      let underlineTop = "80px";
      setUnderlineStyle({ left: `${offsetLeft}px`, width: `${offsetWidth}px`, top: underlineTop });
    }
  }, [showLoading]);

  // Set default active item to the first category when categories load.
  useEffect(() => {
    if (data?.categories.length && !activeItem) {
      setActiveItem(data.categories[0].name);
    }
    // Add a resize listener to update underline position when window resizes.
    const handleResize = () => {
      updateUnderlinePosition();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data, activeItem, setActiveItem]);

  // If there's an error fetching categories, update error state.
  useEffect(() => {
    if (error) {
      setError(true);
    }
  }, [error, setError]);

  // Update cart quantity whenever the cartItems array changes.
  useEffect(() => {
    const totalQuantity = cartItems.reduce((acc, product) => acc + product.quantity, 0);
    setCartQuantity(totalQuantity);
  }, [cartItems]);

  // Update underline position when the mobile menu open state changes.
  useEffect(() => {
    updateUnderlinePosition();
  }, [isMenuOpen]);

  // Recalculate underline position after the active item changes.
  useLayoutEffect(() => {
    updateUnderlinePosition();
  }, [activeItem]);

  // If still loading, show the loading screen.
  if (showLoading) {
    return <LoadingScreen />;
  }

  return (
    <nav className="navbar navbar-expand-lg bg-white position-relative p-0 z-3">
      <div className="container-fluid">
        {/* Mobile menu toggler */}
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

        {/* Navigation links */}
        <div className="collapse navbar-collapse mobile-menu" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            {data?.categories.map((category, index) => (
              <Link
                key={`${category.name}-${index}`}
                to="/"
                // Attach ref if this category is active
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
            {/* Underline element positioned based on active item */}
            {activeItem && (
              <span
                className={`active-underline position-absolute ${isMenuOpen ? "show" : "hide"}`}
                style={underlineStyle}
              ></span>
            )}
          </div>
        </div>

        {/* Logo in the center */}
        <Link to="/" className="navbar-brand mx-auto position-absolute start-50 translate-middle-x">
          <img src={logo} alt="logo" />
        </Link>

        {/* Shopping cart icon with quantity badge */}
        <div className="shopping-cart-container position-relative">
          <img src={cart} alt="cart" className="shopping-cart" onClick={() => setIsOpen(!isOpen)} />
          {isOpen && (
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
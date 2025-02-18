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
 * Displays navigation categories fetched from the server,
 * a logo, and a shopping cart icon with the current cart quantity.
 * Also manages an animated underline that tracks the active navigation link.
 */
const Header: React.FC = () => {
  // Retrieve active category and its setter from CategoryContext.
  const { activeItem, setActiveItem } = useCategory();
  // Retrieve cart state from CartContext.
  const { isOpen, setIsOpen, cartItems } = useCart();
  // Retrieve error setter from ErrorContext.
  const { setError } = useError();

  // Fetch categories from GraphQL.
  const { loading, error, data } = useQuery<{ categories: Category[] }>(GET_CATEGORIES);

  // State to store the style (left, width, top) for the underline.
  const [underlineStyle, setUnderlineStyle] = useState<{ left: string; width: string; top: string }>({
    left: "0px",
    width: "0px",
    top: "0px", // This will be updated after the active item renders.
  });

  // Create a ref to hold the DOM element of the active navigation link.
  const activeItemRef = useRef<HTMLAnchorElement | null>(null);

  // Local state for controlling the mobile menu open/closed.
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  // Local state for the total quantity of items in the cart.
  const [cartQuantity, setCartQuantity] = useState<number>(0);

  // Use a custom hook to ensure the loading indicator is shown for at least 2.5 seconds.
  const showLoading = useDelayedLoading(loading, 2500);

  /**
   * updateUnderlinePosition
   * Calculates and sets the underline's position and dimensions based on the active navigation element.
   * For mobile (window.innerWidth <= 992), the top position is adjusted using the element's offsetTop and offsetHeight.
   * Otherwise, it defaults to "80px".
   */
  const updateUnderlinePosition = () => {
    if (activeItemRef.current) {
      const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = activeItemRef.current;
      let underlineTop = "80px";
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

  // Update underline style when loading is finished and the active element is available.
  useEffect(() => {
    if (!loading && data?.categories.length && activeItemRef.current) {
      const { offsetLeft, offsetWidth } = activeItemRef.current;
      let underlineTop = "80px";
      setUnderlineStyle({ left: `${offsetLeft}px`, width: `${offsetWidth}px`, top: underlineTop });
    }
  }, [showLoading]);

  // Set default active category (if none is set) and add a resize listener to update the underline position.
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

  // If there's an error fetching categories, update the error state.
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

  // Update underline position when the active category changes.
  useLayoutEffect(() => {
    updateUnderlinePosition();
  }, [activeItem]);

  // If the loading delay is still active, render the LoadingScreen.
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
            {/* Underline element that tracks the active navigation link */}
            {activeItem && (
              <span
                className={`active-underline position-absolute ${isMenuOpen ? "show" : "hide"}`}
                style={underlineStyle}
              ></span>
            )}
          </div>
        </div>

        {/* Logo centered in the header */}
        <Link to={`/${activeItem}`} className="navbar-brand mx-auto position-absolute start-50 translate-middle-x">
          <img src={logo} alt="logo" />
        </Link>

        {/* Shopping Cart Icon */}
        <div className="shopping-cart-container position-relative">
          <img src={cart} alt="cart" className="shopping-cart" onClick={() => setIsOpen(!isOpen)} data-testid='cart-btn' />
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
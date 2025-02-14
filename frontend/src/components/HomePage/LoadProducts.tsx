import React from "react";
import { TbShoppingCartSearch } from "react-icons/tb";
import "./LoadProduct.css";

/**
 * LoadProduct Component
 * Displays a loading spinner while products are being fetched.
 */
const LoadProduct: React.FC = () => {
    return (
        <div className="col position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center">
            <TbShoppingCartSearch className="loader" />
        </div>
    );
}

export default LoadProduct;
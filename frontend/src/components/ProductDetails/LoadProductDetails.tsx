import React from "react";
import { TbShoppingCartDown } from "react-icons/tb";
import "./LoadProductDetails.css";

/**
 * LoadProductDetails Component
 *
 * Indicate that product details are loading.
 *
 */
const LoadProductDetails: React.FC = () => {
  return (
    <div className="col-12 position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center">
      <TbShoppingCartDown className="details-loader" />
    </div>
  );
};

export default LoadProductDetails;

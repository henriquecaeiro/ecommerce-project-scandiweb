import React from "react";
import { TbShoppingCartUp } from "react-icons/tb";
import "./LoadCart.css"

/**
 * LoadCart Component
 *
 * Indicates that the product is being ordered.
 *
 */
const LoadCart: React.FC = () => {
  return (
    <div className="col-12 w-100 h-100 d-flex justify-content-center align-items-center my-5">
      <TbShoppingCartUp className="loader" />
    </div>
  );
};

export default LoadCart;

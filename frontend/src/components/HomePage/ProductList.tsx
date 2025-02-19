import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { AttributeResult } from "../../interfaces/Attributes";
import { Product } from "../../interfaces/Product";
import { GET_ATTRIBUTES } from "../../apollo/queries/attributeQueries";
import { MdOutlineImageNotSupported } from "react-icons/md";
import cart from "../../assets/cart.svg";
import "./ProductList.css";
import { handleMouseEnterHelper, handleCartClickHelper } from "../../helpers/productListHelpers";
import { useCart } from "../../context/CartContext";
import { CartItem } from "../../interfaces/Cart";

/**
 * ProductList Component
 *
 * Renders a single product card for a product list. It displays the product's image,
 * name, price, and provides an option to add the product to the cart (when hovered).
 * It also fetches both "text" and "swatch" attributes from a GraphQL endpoint.
 *
 * @param {Object} props - Component props.
 * @param {Product} props.product - The product data to be displayed.
 */
const ProductList: React.FC<{ product: Product }> = ({ product }) => {
  // Track the currently hovered product's ID to apply a "selected" style.
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // State to track if there was an error loading the product image.
  const [imageError, setImageError] = useState<boolean>(false);

  // Context variables for handling the cart stored in localStorage.
  const { getStoredCart, saveCart } = useCart();

  // Fetch "text" attributes for the product via GraphQL.
  const { loading: textLoading, error: textError, data: textData } =
    useQuery<AttributeResult>(GET_ATTRIBUTES, {
      variables: { productId: product.id, type: "text" },
      skip: !product,
    });

  // Fetch "swatch" attributes for the product via GraphQL.
  const { loading: swatchLoading, error: swatchError, data: swatchData } =
    useQuery<AttributeResult>(GET_ATTRIBUTES, {
      variables: { productId: product.id, type: "swatch" },
      skip: !product,
    });

  return (
    <div
      className={`col-sm-6 col-lg-4 product-container my-5 d-flex flex-column align-items-center ${product.id === selectedProductId ? "selected" : ""
        }`}
      onMouseEnter={() => handleMouseEnterHelper(product.id, selectedProductId, setSelectedProductId)}
      onMouseLeave={() => handleMouseEnterHelper(null, selectedProductId, setSelectedProductId)}
      data-testid={`product-${product.name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <Link to={`/details/${product.id}`} className="text-decoration-none text-dark">
        <div className="productImage-size mt-4 position-relative d-flex justify-content-center">
          {/* Product Image */}
          {imageError ? (
            <MdOutlineImageNotSupported className="w-75 h-75 d-flex justify-content-center align-items-center" />
          ) : (
            <img
              src={product.image_url[0]}
              alt={product.name}
              className="w-100 h-100"
              onError={() => setImageError(true)}
            />
          )}
          {product.in_stock === 0 && (
            <>
              <span className="out-of-stock position-absolute top-50">OUT OF STOCK</span>
              <div className="bg-out position-absolute bottom-0 h-100 w-100"></div>
            </>
          )}
          {/* Add To Cart Button */}
          {product.id === selectedProductId && product.in_stock !== 0 && (
            <span
              className="icon position-absolute d-flex justify-content-center align-items-center"
              onClick={(event) =>
                handleCartClickHelper(
                  event,
                  product,
                  textData,
                  swatchData,
                  () => getStoredCart("cart"),
                  (cart: CartItem[]) => saveCart(cart, "cart")
                )
              }
              aria-label="ADD"
            >
              <img src={cart} alt="cart" />
            </span>
          )}
        </div>
        {/* Product Price and Name */}
        <div className="mt-3 w-100 px-4 d-flex flex-column">
          <div className="text-start">
            <h1 className="product-title m-0">{product.name}</h1>
            <p className="product-price m-0">
              {product.currency_symbol}
              {product.price_amount}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductList;
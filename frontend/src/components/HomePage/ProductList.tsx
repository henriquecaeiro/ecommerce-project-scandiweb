import React, { useState } from "react";
import { Link } from "react-router-dom";
import cart from "../../assets/cart.svg";
import { MdOutlineImageNotSupported } from "react-icons/md";
import "./ProductList.css";

interface ProductListProps {
    id: number;
    name: string;
    in_stock: number;
    image_url: string;
    currency_symbol: string;
    price_amount: number;
}

/**
 * ProductList Component
 * Displays the poduct list fetched from the server.
 */
const ProductList: React.FC<{ product: ProductListProps }> = ({ product }) => {
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [imageError, setImageError] = useState<boolean>(false);

    //Apply a selected class to the hovered product
    const handleMouseEnter = (productId: number) => {
        setSelectedProductId(productId === selectedProductId ? null : productId);
    };

    //Add to cart function
    const handleCartClick = (event: React.MouseEvent<HTMLSpanElement>) => {
        console.log("Ícone clicado!");
    };

    return (
        <div
            className={`col-md-4 product-container my-5 d-flex flex-column align-items-center ${product.id === selectedProductId ? "selected" : ""}`}
            onMouseEnter={() => handleMouseEnter(product.id)}
            onMouseLeave={() => handleMouseEnter(0)}
            data-testid={`product-${product.id}`} 
        >
            <Link to={`/details/${product.id}`} className="text-decoration-none text-dark">
                <div className="productImage-size mt-4 position-relative d-flex justify-content-center">
                    {imageError ? (
                        // Exibe ícone do React Icons se a imagem falhar
                        <MdOutlineImageNotSupported  className="w-75 h-75 d-flex justify-content-center align-items-center" />
                    ) : (
                        // Exibe a imagem normal
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-100 h-100"
                            onError={() => setImageError(true)} // Ativa o fallback se a imagem falhar
                        />
                    )}
                    {product.in_stock === 0 && (
                        <>
                            <span className="out-of-stock position-absolute">OUT OF STOCK</span>
                            <div className="bg-out position-absolute bottom-0 h-100 w-100"></div>
                        </>
                    )}

                    {product.id === selectedProductId && product.in_stock !== 0 && (
                        <span
                            className="icon position-absolute d-flex justify-content-center align-items-center "
                            onClick={(event) => handleCartClick(event)}
                        >
                            <img src={cart} alt="cart" />
                        </span>
                    )}
                </div>
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
}

export default ProductList
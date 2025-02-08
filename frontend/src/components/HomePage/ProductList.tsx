import React, { useState } from "react";
import { Link } from "react-router-dom";
import cart from "../../assets/cart.svg";
import { MdOutlineImageNotSupported } from "react-icons/md";
import "./ProductList.css";
import { useQuery } from "@apollo/client";
import { AttributeResult } from "../../interfaces/Attributes";
import { GET_ATTRIBUTES } from "../../apollo/queries/attributeQueries";
import { CartItem } from "../../interfaces/CartItem";
import useCartLocal from "../../hooks/useCartLocal";
import { Product } from "../../interfaces/Product";


/**
 * ProductList Component
 * Displays the poduct list fetched from the server.
 */
const ProductList: React.FC<{ product: Product }> = ({ product }) => {
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [imageError, setImageError] = useState<boolean>(false);
    const [cartItems, setCartItems, getStoredCart] = useCartLocal("cart", []);

    //Apply a selected class to the hovered product
    const handleMouseEnter = (productId: string | null) => {
        setSelectedProductId(productId === selectedProductId ? null : productId);
    };

    // Fetch attributes for "text"
    const { loading: textLoading, error: textError, data: textData } =
        useQuery<AttributeResult>(GET_ATTRIBUTES, {
            variables: { productId: product.id, type: "text" },
            skip: !product, // Only fetch when the product is available
        });

    // Fetch attributes for "swatch"
    const { loading: swatchLoading, error: swatchError, data: swatchData } =
        useQuery<AttributeResult>(GET_ATTRIBUTES, {
            variables: { productId: product.id, type: "swatch" },
            skip: !product, // Only fetch when the product is available
        });

    //Add to cart function
    const handleCartClick = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();

        if (!product || !swatchData?.attributes || !textData?.attributes) return;

        // **Criando um objeto para armazenar os primeiros valores únicos de cada tipo de atributo de texto**
        const textSelectedMap: Record<string, string> = {};
        textData.attributes.forEach((attribute) => {
            if (!textSelectedMap[attribute.name]) {
                textSelectedMap[attribute.name] = attribute.value; // Pegando apenas o primeiro valor de cada grupo
            }
        });

        const newItem: CartItem = {
            product: {
                id: product.id,
                name: product.name,
                in_stock: product.in_stock,
                image_url: [product.image_url[0]],
                currency_symbol: product.currency_symbol,
                price_amount: product.price_amount,
            },
            swatch_attributes: swatchData.attributes,
            text_attributes: textData.attributes,
            swatch_selected: swatchData.attributes.length > 0 ? { [swatchData.attributes[0].name]: swatchData.attributes[0].value } : {},
            text_selected: textSelectedMap, // Agora armazenamos como um **objeto nome-valor**
            quantity: 1,
            key: `${product.id}-${Date.now()}`,
        };

        // **Obtém o carrinho diretamente do localStorage**
        const prevCart = getStoredCart();
        let updatedCart;

        // **Se o carrinho estava vazio, reinicializa ele com o novo item**
        if (prevCart.length === 0) {
            updatedCart = [newItem];
        } else {
            // **Verifica se já existe o produto no carrinho com os mesmos atributos selecionados**
            const existingItemIndex = prevCart.findIndex(
                (cartItem) =>
                    cartItem.product.id === newItem.product.id &&
                    JSON.stringify(cartItem.swatch_selected) === JSON.stringify(newItem.swatch_selected) &&
                    JSON.stringify(cartItem.text_selected) === JSON.stringify(newItem.text_selected)
            );

            if (existingItemIndex !== -1) {
                // **Se já existe, apenas incrementa a quantidade**                  
                updatedCart = prevCart.map((cartItem, index) =>
                    index === existingItemIndex
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                // **Se não existe, adiciona como novo item**
                updatedCart = [...prevCart, newItem];
            }
        }

        // **Atualiza o localStorage**
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        window.dispatchEvent(new Event("cartUpdated"));
    };




    return (
        <div
            className={`col-md-4 product-container my-5 d-flex flex-column align-items-center ${product.id === selectedProductId ? "selected" : ""}`}
            onMouseEnter={() => handleMouseEnter(product.id)}
            onMouseLeave={() => handleMouseEnter(null)}
            data-testid={`product-${product.id}`}
        >
            <Link to={`/details/${product.id}`} className="text-decoration-none text-dark">
                <div className="productImage-size mt-4 position-relative d-flex justify-content-center">
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
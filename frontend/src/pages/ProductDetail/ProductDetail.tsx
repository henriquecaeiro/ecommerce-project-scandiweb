import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GET_SINGLE_PRODUCT } from "../../apollo/queries/productQueries";
import { GET_ATTRIBUTES } from "../../apollo/queries/attributeQueries";
import AttributesSection from "../../components/ProductDetails/AttributesSection";
import "./ProductDetail.css";
import arrowLeft from "../../assets/arrow-left.svg";
import arrowRight from "../../assets/arrow-right.svg";
import { useCategory } from "../../context/CategoryContext";
import parse from "html-react-parser"
import { AttributeResult } from "../../interfaces/Attributes";
import { AttributeSelection, useCart } from "../../context/CartContext";
import { ProductParams, ProductResult } from "../../interfaces/Product";
import { CartItem } from "../../interfaces/CartItem";
import useCartLocal from "../../hooks/useCartLocal";
import LoadProductDetails from "../../components/ProductDetails/LoadProductDetails";
import { FaBoxesStacked } from "react-icons/fa6";


/**
 * ProductDetail Component
 * Displays the details of the product based.
 */
const ProductDetail: React.FC = () => {
    const { id } = useParams<ProductParams>();

    const { setActiveItem } = useCategory();

    const { selectedAttributes, isOpen, setIsOpen, setSelectedAttributes } = useCart();


    const { loading: productLoading, error: productError, data: productData } = useQuery<ProductResult>(GET_SINGLE_PRODUCT, {
        variables: { category: "all", id: id },
    });

    const product = productData?.products[0];

    const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

    const [cartItems, setCartItems, getStoredCart] = useCartLocal("cart", []);

    const [isAttibutesSelected, setIsAttributesSelected] = useState<boolean>(false);

    const nextImage = () => {
        if (product?.image_url) {
            setActiveImageIndex((prevIndex) => (prevIndex + 1) % product.image_url.length)
        }
    }

    const prevImage = () => {
        if (product?.image_url) {
            setActiveImageIndex((prevIndex) => prevIndex === 0 ? product.image_url.length - 1 : prevIndex - 1)
        }
    }

    useEffect(() => {
        setSelectedAttributes({});
    }, [id]);


    useEffect(() => {
        if (product?.image_url) {
            setActiveImageIndex(0);
        }

        if (product?.category_name) {
            setActiveItem(product?.category_name);
        }
    }, [product]);

    // Fetch attributes for "text"
    const { loading: textLoading, error: textError, data: textData } =
        useQuery<AttributeResult>(GET_ATTRIBUTES, {
            variables: { productId: id, type: "text" },
            skip: !product, // Only fetch when the product is available
        });

    // Fetch attributes for "swatch"
    const { loading: swatchLoading, error: swatchError, data: swatchData } =
        useQuery<AttributeResult>(GET_ATTRIBUTES, {
            variables: { productId: id, type: "swatch" },
            skip: !product, // Only fetch when the product is available
        });

    const textAttributes = textData?.attributes;
    const swatchAttributes = swatchData?.attributes;

    const textAttributeName = textAttributes?.reduce((acc, attribute) => {
        const key = attribute.name;

        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(attribute)

        return acc
    }, {} as Record<string, typeof textAttributes>)

    const swatchAttributeName = swatchAttributes?.reduce((acc, attribute) => {
        const key = attribute.name;

        if (!acc[key]) {
            acc[key] = []
        }

        acc[key].push(attribute)

        return acc
    }, {} as Record<string, typeof swatchAttributes>)

    useEffect(() => {
        const hasNoSelectableAttributes =
            (textAttributes?.length ?? 0) === 0 &&
            (swatchAttributes?.length ?? 0) === 0;

        setIsAttributesSelected(hasNoSelectableAttributes);
    }, [textAttributes, swatchAttributes]);

    useEffect(() => {
        const filteredTextValues = new Set<string>();

        if (!textAttributes) return;

        textAttributes.forEach((attribute) => {
            filteredTextValues.add(attribute.name);
        });

        if (filteredTextValues.size === Object.keys(selectedAttributes.text || {}).length) {
            const allTextAttributesNotEmpty = Object.values(selectedAttributes.text ?? {}).every(value => value !== "")

            if (allTextAttributesNotEmpty) {
                setIsAttributesSelected(true)
            }
        }

    }, [selectedAttributes, textAttributes]);

    function clearStringValues(obj: Record<string, any>): void {

        for (let key in obj) {
            // Se o valor for string, substitui-o por uma string vazia
            if (typeof obj[key] === 'string') {
                obj[key] = '';
                setIsAttributesSelected(false)
            }
            // Se o valor for objeto (e não array), chama a função de forma recursiva
            else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                clearStringValues(obj[key]);
            }
        }
    }

    const handleProduct = () => {
        if (!product || !swatchData?.attributes || !textData?.attributes) return;

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
            swatch_selected: selectedAttributes.swatch || {}, // Usa {} caso undefined
            text_selected: selectedAttributes.text || {}, // Usa {} caso undefined
            quantity: 1,
            key: `${product.id}-${Date.now()}`,
        };

        // Obtendo o carrinho diretamente do localStorage
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

        clearStringValues(selectedAttributes)

        // **Abre o modal do carrinho**
        setTimeout(() => setIsOpen(true), 250);

        window.dispatchEvent(new Event("cartUpdated"));
    };


    return (
        <div className="container-fluid">
            <div className="row mt-4">
                {productLoading || swatchLoading || textLoading ?
                    <LoadProductDetails /> :
                    <>
                        <div className="col-lg-7 col-md-12 d-flex justify-content-center align-items-center" data-testid="product-gallery">
                            {/* Container das miniaturas (alinhadas à esquerda) */}
                            <div className="thumbnail-container d-flex flex-column mx-5 d-none d-md-flex">
                                {productError || swatchError || textError ?
                                    <div key="error-thumbnail"
                                        className={`img-container position-relative active-error`}>
                                        <FaBoxesStacked className="thumbnail-error" />
                                    </div>
                                    : product?.image_url.map((url, index) => (
                                        <div
                                            key={index}
                                            className={`img-container position-relative ${index === activeImageIndex && "active"}`}
                                            onClick={() => setActiveImageIndex(index)}
                                        >
                                            <img
                                                src={url}
                                                alt={`${product?.name} ${index + 1}`}
                                                className="thumbnail"
                                            />
                                            {product?.in_stock === 0 &&
                                                <>
                                                    <div className="out-of-stock-bg position-absolute bottom-0 h-100 w-100"></div>
                                                </>
                                            }
                                        </div>
                                    ))}
                            </div>

                            {
                                Array.isArray(product?.image_url) && product.image_url.length > 1 && (!productError || !swatchError || !textError) ? (
                                    <div className="carousel-container ms-5 position-relative">
                                        <button className="carousel-btn prev d-flex align-items-center" onClick={prevImage}>
                                            <img src={arrowLeft} alt="arrow-left" />
                                        </button>

                                        <img
                                            src={product?.image_url[activeImageIndex]}
                                            alt={`${product?.name} ${activeImageIndex + 1}`}
                                        />

                                        {product?.in_stock === 0 &&
                                            <>
                                                <span className="out-of-stock position-absolute top-50">OUT OF STOCK</span>
                                                <div className="out-of-stock-bg position-absolute bottom-0 h-100 w-100"></div>
                                            </>}

                                        <button className="carousel-btn next d-flex align-items-center" onClick={nextImage}>
                                            <img src={arrowRight} alt="arrow-right" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className={`carousel-container ms-5 position-relative`}>
                                        <FaBoxesStacked className="icon-product-error" />
                                    </div>
                                )
                            }

                        </div>


                        {productError || swatchError || textError ?
                            <div className="col-lg-5 col-md-12 product-details">
                                <h1 className="product-name">Product not found</h1>
                                <div className="shopping-container">
                                    <div className="price-container">
                                        <p className="price-header">PRICE:</p>
                                        <span className="price">$00.00</span>
                                    </div>
                                        <Link to="/" className="return-link d-flex justify-content-center align-items-center">
                                            <p className="return-link-text m-0">BACK TO HOME PAGE</p>
                                        </Link>
                                </div>
                            </div>
                            :
                            <div className="col-lg-5 col-md-12 product-details">
                                <h1 className="product-name">{product?.name}</h1>
                                <div className={`attributes-container ${textAttributeName && Object.entries(textAttributeName).length > 1 ? "multiple-attributes" : ""}`}>
                                    <div className="row">
                                        {textAttributeName &&
                                            Object.entries(textAttributeName).map(([name, attributes], index, array) => (
                                                (array.length > 1 ? (
                                                    <div key={name} className="col-lg-6 col-md-12">
                                                        <AttributesSection title={name} attributes={attributes} multiple={true} product_id={id as string} />
                                                    </div>
                                                ) : (
                                                    <div key={name} className="col-12">
                                                        <AttributesSection title={name} attributes={attributes} multiple={false} product_id={id as string} />
                                                    </div>
                                                ))
                                            ))
                                        }

                                        {swatchAttributeName &&
                                            Object.entries(swatchAttributeName).map(([name, attributes], index, array) => (
                                                (array.length > 1 ? (
                                                    <div key={name} className="col-lg-6 col-md-12">
                                                        <AttributesSection title={name} attributes={attributes} multiple={true} product_id={id as string} />
                                                    </div>
                                                ) : (
                                                    <div key={name} className="col-12">
                                                        <AttributesSection title={name} attributes={attributes} multiple={false} product_id={id as string} />
                                                    </div>
                                                ))
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className="shopping-container">
                                    <div className="price-container">
                                        <p className="price-header">PRICE:</p>
                                        <span className="price">{product?.currency_symbol}{product?.price_amount}</span>
                                    </div>
                                    <button className={`${(product?.in_stock === 0 || !isAttibutesSelected) ? "disabled" : "shopping-button"}`}
                                        data-testid="add-to-cart"
                                        onClick={() => (isAttibutesSelected && product?.in_stock !== 0) && handleProduct()}
                                    >ADD TO CART</button>
                                </div>
                                {product?.description && (
                                    <div className="description mb-4" data-testid="product-description">{parse(product.description)}</div>
                                )}
                            </div>
                        }

                    </>
                }

            </div>
        </div>
    );
}

export default ProductDetail
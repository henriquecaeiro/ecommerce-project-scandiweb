import { useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaBoxesStacked } from "react-icons/fa6";
import parse from "html-react-parser"
import { GET_SINGLE_PRODUCT } from "../../apollo/queries/productQueries";
import { GET_ATTRIBUTES } from "../../apollo/queries/attributeQueries";
import AttributesSection from "../../components/ProductDetails/AttributesSection";
import LoadProductDetails from "../../components/ProductDetails/LoadProductDetails";
import { useCategory } from "../../context/CategoryContext";
import { useCart } from "../../context/CartContext";
import { handleProduct, nextImageHelper, prevImageHelper } from "../../helpers/productDetailsHelpers";
import { AttributeResult } from "../../interfaces/Attributes";
import { ProductParams, ProductResult } from "../../interfaces/Product";
import arrowLeft from "../../assets/arrow-left.svg";
import arrowRight from "../../assets/arrow-right.svg";
import "./ProductDetail.css";
import { CartItem } from "../../interfaces/Cart";
import useDelayedLoading from "../../hooks/useDelayedLoading";

/**
 * ProductDetail Component
 * Displays the details of the product based.
 */
const ProductDetail: React.FC = () => {
    const { id } = useParams<ProductParams>();

    const { setActiveItem } = useCategory();
    const { selectedAttributes, setIsOpen, setSelectedAttributes, getStoredCart, saveCart } = useCart();

    // Fetch product data from GraphQL API
    const { loading: productLoading, error: productError, data: productData } = useQuery<ProductResult>(GET_SINGLE_PRODUCT, {
        variables: { category: "all", id: id },
        fetchPolicy: "no-cache",
    });

    // Seting minimum loading time
    const minProductLoading = useDelayedLoading(productLoading, 500);

    const product = productData?.products[0];

    // Local states for image gallery navigation and verify if all necessary attributes is selected
    const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
    const [isAttibutesSelected, setIsAttributesSelected] = useState<boolean>(false);

    // Timer reference for delayed modal opening
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /**
     * Clears timeout when the component is unmounted.
     */
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    /**
     * Resets selected attributes when changing products.
     */
    useEffect(() => {
        setSelectedAttributes({
            swatch_selected: {},
            text_selected: {},
        });
    }, [id]);

    /**
     * Updates category and resets image index when a new product is loaded.
     */
    useEffect(() => {
        if (product?.image_url) {
            setActiveImageIndex(0);
        }

        if (product?.category_name) {
            setActiveItem(product?.category_name);
        }
    }, [product]);

    // Fetch text and swatch attributes
    const { loading: textLoading, error: textError, data: textData } =
        useQuery<AttributeResult>(GET_ATTRIBUTES, {
            variables: { productId: id, type: "text" },
            skip: !product,
        });

    const { loading: swatchLoading, error: swatchError, data: swatchData } =
        useQuery<AttributeResult>(GET_ATTRIBUTES, {
            variables: { productId: id, type: "swatch" },
            skip: !product,
        });

    // Extract attributes from fetched data
    const textAttributes = textData?.attributes;
    const swatchAttributes = swatchData?.attributes;

    /**
     * Groups attributes by their name.
     */
    const textAttributeName = Object.fromEntries(
        textAttributes?.map(attr => [attr.name, textAttributes.filter(a => a.name === attr.name)]) || []
    );

    const swatchAttributeName = swatchAttributes?.reduce((acc, attribute) => {
        const key = attribute.name;

        if (!acc[key]) {
            acc[key] = []
        }

        acc[key].push(attribute)

        return acc
    }, {} as Record<string, typeof swatchAttributes>)

    /**
     * Checks if all necessary attributes are selected
     */
    useEffect(() => {
        if (!textAttributes && !swatchAttributes) return;

        const noSelectableAttributes =
            (textAttributes?.length ?? 0) === 0 && (swatchAttributes?.length ?? 0) === 0;

        const requiredTextAttributes = new Set(textAttributes?.map(attr => attr.name) ?? []);

        const selectedTextEntries = Object.entries(selectedAttributes.text_selected || {}).filter(
            ([key]) => key !== "attributeId"
        );

        const allTextAttributesSelected =
            requiredTextAttributes.size === 0 ||
            (selectedTextEntries.length === requiredTextAttributes.size &&
                selectedTextEntries.every(
                    ([key, value]) =>
                        requiredTextAttributes.has(key) &&
                        (typeof value === "string" ? value.trim() !== "" : true)
                ));

        const requiredSwatchAttributes = new Set(swatchAttributes?.map(attr => attr.name) ?? []);

        const selectedSwatchEntries = Object.entries(selectedAttributes.swatch_selected || {}).filter(
            ([key]) => key !== "attributeId"
        );

        const allSwatchAttributesSelected =
            requiredSwatchAttributes.size === 0 ||
            (selectedSwatchEntries.length === requiredSwatchAttributes.size &&
                selectedSwatchEntries.every(
                    ([key, value]) =>
                        requiredSwatchAttributes.has(key) &&
                        (typeof value === "string" ? value.trim() !== "" : true)
                ));

        setIsAttributesSelected(noSelectableAttributes || (allTextAttributesSelected && allSwatchAttributesSelected));
    }, [textAttributes, swatchAttributes, selectedAttributes]);

    return (
        <div className="container-fluid">
            <div className="row mt-4">
                {minProductLoading || swatchLoading || textLoading ?
                    <LoadProductDetails /> :
                    <>
                        <div className="col-lg-7 col-md-12 d-flex justify-content-center align-items-center" data-testid="product-gallery">
                            {/* Thumbnails */}
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
                            {/* Main Image */}
                            {
                                !productError || !swatchError || !textError ? (
                                    (Array.isArray(product?.image_url) && product.image_url.length > 1 ?
                                        <div className="carousel-container ms-md-5 position-relative">
                                            <button className="carousel-btn prev d-flex align-items-center" onClick={() => {
                                                if (product?.image_url) {
                                                    setActiveImageIndex(prevIndex => prevImageHelper(prevIndex, product.image_url.length));
                                                }
                                            }}>
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
                                                </>
                                            }

                                            <button className="carousel-btn next d-flex align-items-center" onClick={() => {
                                                if (product?.image_url) {
                                                    setActiveImageIndex(prevIndex => nextImageHelper(prevIndex, product.image_url.length));
                                                }
                                            }}>
                                                <img src={arrowRight} alt="arrow-right" />
                                            </button>
                                        </div> :
                                        <div className="carousel-container ms-md-5 position-relative">
                                            <img
                                                src={product?.image_url[activeImageIndex]}
                                                alt={`${product?.name} ${activeImageIndex + 1}`}
                                            />

                                            {product?.in_stock === 0 &&
                                                <>
                                                    <span className="out-of-stock position-absolute top-50">OUT OF STOCK</span>
                                                    <div className="out-of-stock-bg position-absolute bottom-0 h-100 w-100"></div>
                                                </>
                                            }
                                        </div>
                                    )

                                ) : (
                                    <div className={`carousel-container ms-5 position-relative`}>
                                        <FaBoxesStacked className="icon-product-error" />
                                    </div>
                                )
                            }
                        </div>
                        {/* Product Details */}
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
                                <div className={`attributes-container w-100 ${textAttributeName && Object.entries(textAttributeName).length > 1 ? "multiple-attributes" : ""}`}>
                                    <div className="row">
                                        {textAttributeName &&
                                            Object.entries(textAttributeName).map(([name, attributes], index, array) => (
                                                (array.length > 1 ? (
                                                    <div key={name} 
                                                    className={`col-lg-6 col-md-12 ${swatchAttributeName && Object.keys(swatchAttributeName).length > 0 ? "text-container" : ""}`}
                                                    data-testid={`product-attribute-${name.toLowerCase().replace(/\s+/g, "-")}`}>
                                                        <AttributesSection title={name} attributes={attributes} multiple={true} />
                                                    </div>
                                                ) : (
                                                    <div key={name} 
                                                    className={`col-12 ${swatchAttributeName && Object.keys(swatchAttributeName).length > 0 ? "text-container" : ""}`}
                                                    data-testid={`product-attribute-${name.toLowerCase().replace(/\s+/g, "-")}`}>
                                                        <AttributesSection title={name} attributes={attributes} multiple={false} />
                                                    </div>
                                                ))
                                            ))
                                        }
                                        {swatchAttributeName &&
                                            Object.entries(swatchAttributeName).map(([name, attributes], index, array) => (
                                                (array.length > 1 ? (
                                                    <div key={name} className="col-lg-6 col-md-12" data-testid={`product-attribute-${name.toLowerCase().replace(/\s+/g, "-")}`}>
                                                        <AttributesSection title={name} attributes={attributes} multiple={true} />
                                                    </div>
                                                ) : (
                                                    <div key={name} className="col-12" data-testid={`product-attribute-${name.toLowerCase().replace(/\s+/g, "-")}`}>
                                                        <AttributesSection title={name} attributes={attributes} multiple={false} />
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
                                    <button
                                        className={`${(product?.in_stock === 0 || !isAttibutesSelected) ? "disabled" : "shopping-button"}`}
                                        data-testid="add-to-cart"
                                        onClick={() => {
                                            if (isAttibutesSelected && product?.in_stock !== 0) {
                                                handleProduct({
                                                    product,
                                                    textData,
                                                    swatchData,
                                                    selectedAttributes,
                                                    getStoredCart: () => getStoredCart("cart"),
                                                    saveCart: (cart: CartItem[]) => saveCart(cart, "cart"),
                                                    setSelectedAttributes,
                                                    setIsOpen,
                                                    timeoutRef,
                                                });
                                            }
                                        }}
                                        disabled={product?.in_stock === 0 || !isAttibutesSelected}
                                    >
                                        ADD TO CART
                                    </button>
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
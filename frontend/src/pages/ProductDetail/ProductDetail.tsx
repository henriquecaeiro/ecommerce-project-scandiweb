import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_SINGLE_PRODUCT } from "../../apollo/queries/productQueries";
import { GET_ATTRIBUTES } from "../../apollo/queries/attributeQueries";
import AttributesSection from "../../components/ProductDetails/AttributesSection";
import "./ProductDetail.css";
import arrowLeft from "../../assets/arrow-left.svg";
import arrowRight from "../../assets/arrow-right.svg";
import { useCategory } from "../../context/CategoryContext";
import parse from "html-react-parser"

interface ProductParams extends Record<string, string | undefined> {
    id: string;
}

interface Product {
    id: string;
    name: string;
    in_stock: number;
    description: string;
    image_url: string[];
    currency_symbol: string;
    currency_label: string;
    price_amount: number;
    brand: string;
    category_name: string;
}

interface ProductResult {
    products: Product[];
}

interface Attribute {
    name: string
    display_value: string;
    value: string;
}

interface AttributeResult {
    attributes: Attribute[];
}

/**
 * ProductDetail Component
 * Displays the details of the product based.
 */
const ProductDetail: React.FC = () => {
    const { id } = useParams<ProductParams>();

    const { setActiveItem } = useCategory();

    const { loading: productLoading, error: productError, data: productData } = useQuery<ProductResult>(GET_SINGLE_PRODUCT, {
        variables: { category: "all", id: id },
    });

    const product = productData?.products[0];

    const [activeImageIndex, setActiveImageIndex] = useState<number>(0);


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

    if (productLoading || swatchLoading || textLoading) return <p>Loading...</p>;
    if (productError || swatchError || textError)
        return <p>Error loading data. Please try again later.</p>;

    return (
        <div className="container-fluid">
            <div className="row mt-4">
                <div className="col-lg-7 col-md-12 d-flex justify-content-center align-items-center" data-testid="product-gallery">
                    {/* Container das miniaturas (alinhadas à esquerda) */}
                    <div className="thumbnail-container d-flex flex-column mx-5 d-none d-md-flex">
                        {product?.image_url.map((url, index) => (
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
                        Array.isArray(product?.image_url) && product.image_url.length > 1 ? (
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
                                <img
                                    className="w-100"
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
                    }

                </div>

                <div className="col-lg-5 col-md-12 product-details">
                    <h1 className="product-name">{product?.name}</h1>
                    <div className={`attributes-container ${textAttributeName && Object.entries(textAttributeName).length > 1 ? "multiple-attributes" : ""}`}>
                        <div className="row">
                            {textAttributeName &&
                                Object.entries(textAttributeName).map(([name, attributes], index, array) => (
                                    (array.length > 1 ? (
                                        <div key={name} className="col-lg-6 col-md-12">
                                            <AttributesSection title={name} attributes={attributes} multiple={true} />
                                        </div>
                                    ) : (
                                        <div key={name} className="col-lg-6 col-md-12 ">
                                            <AttributesSection title={name} attributes={attributes} multiple={false} />
                                        </div>
                                    ))
                                ))
                            }

                            {swatchAttributeName &&
                                Object.entries(swatchAttributeName).map(([name, attributes], index, array) => (
                                    (array.length > 1 ? (
                                        <div key={name} className="col-lg-6 col-md-12">
                                            <AttributesSection title={name} attributes={attributes} multiple={true} />
                                        </div>
                                    ) : (
                                        <div key={name} className="col-12">
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
                        <button className={`${product?.in_stock === 0 ? "disabled" : "shopping-button"}`} data-testid="add-to-cart">ADD TO CART</button>
                    </div>
                    {product?.description && (
                        <div className="description mb-4" data-testid="product-description">{parse(product.description)}</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetail
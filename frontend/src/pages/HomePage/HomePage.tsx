import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../../apollo/queries/productQueries";
import ProductList from "../../components/HomePage/ProductList";
import LoadProduct from "../../components/HomePage/LoadProducts";
import { useCategory } from "../../context/CategoryContext";
import { useLoading } from "../../context/LoadingContext";
import { useError } from "../../context/ErrorContext";
import { useCart } from "../../context/CartContext";
import useDelayedLoading from "../../hooks/useDelayedLoading";
import { capitalizeFirst } from "../../utils/capitalizeFirst";
import "./HomePage.css";
import { Product } from "../../interfaces/Product";

/**
 * Defines the expected structure of the GraphQL query response.
 */
interface QueryResult {
    products: Product[];
}

/**
 * HomePage Component
 * Displays a list of products based on the currently active category.
 */
const HomePage: React.FC = () => {
    const { activeItem } = useCategory();
    const { finishLoading } = useLoading();
    const { setError } = useError();
    const { isOpen } = useCart();

    // Fetches products based on the selected category
    const { loading, error, data } = useQuery<QueryResult>(GET_PRODUCTS, {
        variables: { category: activeItem },
    });

    // Controls loading animation for a smooth UI experience
    const showLoading = useDelayedLoading(loading, 1500);

    /**
     * Handles the logic for setting loading and error states
     */
    useEffect(() => {
        if (!loading) {
            finishLoading();
        }
        if (error) {
            setError(true);
        }
    }, [loading, finishLoading, error, setError]);

    return (
        <div className="container-fluid z-n1">
            {/* Displays overlay when the cart is open */}
            {isOpen && <div className="cart-active"></div>}

            {/* Page Title */}
            <div className="row mt-5 ms-5">
                <div className="col justify-content-start">
                    <h1 className="page-title">{capitalizeFirst(activeItem)}</h1>
                </div>
            </div>

            {/* Product Listing */}
            <div className="row mt-5 ms-5 g4">
                {showLoading && <LoadProduct />}
                {!showLoading &&
                    data?.products?.map((product) => (
                        <ProductList key={product.id} product={product} />
                    ))}
            </div>
        </div>
    );
};

export default HomePage;
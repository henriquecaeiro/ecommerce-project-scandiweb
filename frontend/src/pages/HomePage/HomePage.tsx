import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../../apollo/queries/productQueries";
import "./HomePage.css";
import ProductList from "../../components/HomePage/ProductList";
import { useCategory } from "../../context/CategoryContext";
import { useLoading } from "../../context/LoadingContext";
import { useError } from "../../context/ErrorContext";
import LoadProduct from "../../components/HomePage/LoadProducts";
import useDelayedLoading from "../../hooks/useDelayedLoading";
import { capitalizeFirst } from "../../utils/capitalizeFirst";

interface Product {
    id: number;
    name: string;
    in_stock: number;
    description: string;
    image_url: string;
    currency_symbol: string;
    price_amount: number;
}

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

    const { loading, error, data } = useQuery<QueryResult>(GET_PRODUCTS, {
        variables: { category: activeItem },
    });

    const showLoading = useDelayedLoading(loading, 1500);

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
            <div className="row mt-5 ms-5">
                <div className="col justify-content-start">
                    <h1 className="page-title">{capitalizeFirst(activeItem)}</h1>
                </div>
            </div>
            <div className="row mt-5 ms-5 g4">
                {showLoading && <LoadProduct />}
                {!showLoading &&
                    data?.products.map((product) => (
                        <ProductList key={product.id} product={product} />
                    ))}
            </div>
        </div>
    );
};

export default HomePage;

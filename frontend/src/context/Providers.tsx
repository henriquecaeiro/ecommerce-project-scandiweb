import React from "react";
import { ErrorProvider } from "./ErrorContext";
import { LoadingProvider } from "./LoadingContext";
import { CartProvider } from "./CartContext";
import { CategoryProvider } from "./CategoryContext";

/**
 *  Parent providers to encapsulate all children providers
 */
const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ErrorProvider>
        <LoadingProvider>
            <CartProvider>
                <CategoryProvider>
                    {children}
                </CategoryProvider>
            </CartProvider>
        </LoadingProvider>
    </ErrorProvider>
)

export default Providers;
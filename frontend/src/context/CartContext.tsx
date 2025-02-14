import React, { createContext, ReactNode, useContext, useEffect, useState, useCallback } from "react";
import {SelectedAttributes} from "../interfaces/Attributes";
import { CartContextType, CartItem } from "../interfaces/Cart";
import useCartLocal from "../hooks/useCartLocal";



// Create the cart context
export const CartContext = createContext<CartContextType | null>(null);

// Define the provider type
interface CartProviderType {
    children: ReactNode;
}

/**
 * CartProvider component: Provides cart-related state management
 */
export const CartProvider: React.FC<CartProviderType> = ({ children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedAttributes, setSelectedAttributes] = useState<SelectedAttributes>({
        swatch_selected: {},
        text_selected: {},
    });
    const [cartItems, setCartItems] = useCartLocal("cart", []);

    /**
     * Retrieves the stored cart from localStorage.
     * @returns The current cart items stored in localStorage.
     */
        const getStoredCart = (key: string): CartItem[] => {
            try {
                const storedItem = window.localStorage.getItem(key);
                return storedItem ? JSON.parse(storedItem) as CartItem[] : [];
            } catch (error) {
                console.error(`Error retrieving "${key}" from localStorage`, error);
                return [];
            }
        };
    
        /**
         * Saves the updated cart data to localStorage and updates state.
         * @param updatedCart - The new cart state to be saved.
         */
        const saveCart = (updatedCart: CartItem[], key: string) => {
            try {
                setCartItems(updatedCart);
                window.localStorage.setItem(key, JSON.stringify(updatedCart));
            } catch (error) {
                console.error("Error saving cart data to localStorage:", error);
            }
        };

    return (
        <CartContext.Provider value={{ isOpen, setIsOpen, selectedAttributes, setSelectedAttributes, cartItems, setCartItems, saveCart, getStoredCart }}>
            {children}
        </CartContext.Provider>
    );
};

/**
 * Custom hook to use the cart context
 * Ensures the hook is only used within the CartProvider
 */
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
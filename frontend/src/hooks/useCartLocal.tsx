import { useState, useEffect } from "react";
import { CartItem } from "../interfaces/Cart";

/**
 * Custom React Hook to manage cart data in localStorage.
 * Provides functionality to retrieve, update, and persist the cart.
 *
 * @param key - The localStorage key for storing cart data.
 * @param initialValue - The initial cart state.
 * @returns [cart, setCart, getStoredCart, saveCart] - State and utility functions for managing the cart.
 */
function useCartLocal(key: string, initialValue: CartItem[]) {
    // State to store cart data, initialized from localStorage
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            const storedItem = window.localStorage.getItem(key);
            return storedItem ? JSON.parse(storedItem) as CartItem[] : initialValue;
        } catch (error) {
            console.error(`Error reading "${key}" from localStorage:`, error);
            return initialValue;
        }
    });

    /**
     * Effect to persist cart state in localStorage whenever it changes.
     */
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(cart));
        } catch (error) {
            console.error(`Error saving "${key}" to localStorage:`, error);
        }
    }, [key, cart]);


    return [cart, setCart] as const;
}

export default useCartLocal;
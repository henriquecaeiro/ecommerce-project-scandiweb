import { useState, useEffect } from "react";
import { CartItem } from "../interfaces/CartItem";

function useCartLocal(key: string, initialValue: CartItem[]) {
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) as CartItem[] : initialValue;
        } catch (error) {
            console.error(`Error reading "${key}" from localStorage:`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(cart));
        } catch (error) {
            console.error(`Error saving "${key}" to localStorage:`, error);
        }
    }, [key, cart]);

    const getStoredCart = (): CartItem[] => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) as CartItem[] : [];
        } catch (error) {
            console.error(`Error retrieving "${key}" from localStorage`, error);
            return [];
        }
    }

    return [cart, setCart, getStoredCart] as const;
}

export default useCartLocal;

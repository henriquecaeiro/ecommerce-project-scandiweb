import React, { createContext, ReactNode, useContext, useState } from "react";

export interface AttributeSelection {
    product_id: string | undefined;
    name: string;
    value: string;
    text: Record<string, string> | string;
    swatch: Record<string, string> | string;
}

interface CartContextType {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    selectedAttributes: Record<string, AttributeSelection>;
    setSelectedAttributes: React.Dispatch<React.SetStateAction<Record<string, AttributeSelection>>>;
}

export const CartContext = createContext<CartContextType | null>(null);

interface CartProviderType {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderType> = ({ children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, AttributeSelection>>({});

    return (
        <CartContext.Provider value={{ isOpen, setIsOpen, selectedAttributes, setSelectedAttributes }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }

    return context;
};

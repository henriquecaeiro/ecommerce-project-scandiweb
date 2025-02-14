import React, { createContext, ReactNode, useContext, useState } from "react";

/**
 * Describes the structure of the CategoryContext.
 */
interface CategoryContextType {
    activeItem: string;
    setActiveItem: (item: string) => void;
}

/**
 * Creates the CategoryContext with an initial value of undefined.
 */
export const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

interface CategoryProviderType {
    children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderType> = ({ children }) => {
    const [activeItem, setActiveItem] = useState<string>("all");

    return (
        <CategoryContext.Provider value={{ activeItem, setActiveItem }}>
            {children}
        </CategoryContext.Provider>
    );
};

/**
 * Custom hook to access the CategoryContext.
 * Ensures the context is used within its provider.
 */
export const useCategory = (): CategoryContextType => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error("useCategory must be used within a CategoryProvider");
    }

    return context;
};

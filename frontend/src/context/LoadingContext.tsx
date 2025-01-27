import React, { createContext, ReactNode, useContext, useState } from "react";

/**
 * Describes the structure of the LoadingContext.
 */
interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
    finishLoading: () => void;
}

/**
 * Creates the LoadingContext with an initial value of undefined.
 */
export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
    children: ReactNode;
}

/**
 * Provides global state management for loading states.
 */
export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const finishLoading = () => {
        setIsLoading(false);
    };

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading, finishLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

/**
 * Custom hook to access the LoadingContext.
 * Ensures the context is used within its provider.
 */
export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};
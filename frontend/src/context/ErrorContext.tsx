import React, { createContext, ReactNode, useContext, useState } from "react";

/**
 * Describes the structure of the ErrorContext.
 */
interface ErrorContextType {
    error: boolean;
    setError: (value: boolean) => void;
}

/**
 * Creates the ErrorContext with an initial value of undefined.
 */

export const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps{
    children: ReactNode
}

/**
 * Provides global state management for errors.
 */
export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
    const [error, setError] = useState<boolean>(false);
    
    return (
        <ErrorContext.Provider value={{error, setError}}>
            {children}
        </ErrorContext.Provider>
    );
}

/**
 * Custom hook to access the ErrorContext.
 * Ensures the context is used within its provider.
 */
export const useError = (): ErrorContextType =>{
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error("useError must be used within an ErrorProvider");
    }
    return context;
};
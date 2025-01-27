import { useEffect, useState } from "react";

/**
 * useDelayedLoading
 * Manages a delayed loading state, ensuring a minimum display time for loaders.
 *
 * @param {boolean} loading - Indicates whether data is still being loaded.
 * @param {number} delay - Minimum time (in milliseconds) to show the loading state after loading is complete.
 * @returns {boolean} - A boolean indicating whether the loader should still be visible.
 *
 */
const useDelayedLoading = (loading:boolean , delay:number) => {
    const [showLoading, setShowLoading] = useState<boolean>(false);

    useEffect(() => {
        let timer: number;

        if (loading) {
            setShowLoading(true); // Show the loader while loading is true
        } else {
            // Wait for the delay before hiding the loader
            timer = setTimeout(() => {
                setShowLoading(false);
            }, delay);
        }

        // Clear the timer on cleanup to avoid memory leaks
        return () => clearTimeout(timer);
    }, [loading, delay]);

    return showLoading;
};

export default useDelayedLoading;

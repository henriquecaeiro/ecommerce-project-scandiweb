import { useEffect, useState } from "react";

/**
 * Custom Hook: useDelayedLoading
 * 
 * This hook ensures that a loading state persists for a minimum display time 
 * before disappearing, preventing flickering issues when loading completes too quickly.
 *
 * @param {boolean} loading - Indicates whether the data is still being loaded.
 * @param {number} delay - Minimum time (in milliseconds) to keep the loading state visible.
 * @returns {boolean} - Returns `true` if the loader should still be displayed.
 */
const useDelayedLoading = (loading: boolean, delay: number): boolean => {
    const [showLoading, setShowLoading] = useState<boolean>(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | null = null;

        if (loading) {
            setShowLoading(true);
        } else {
            timer = setTimeout(() => {
                setShowLoading(false);
            }, delay);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [loading, delay]);

    return showLoading;
};

export default useDelayedLoading;
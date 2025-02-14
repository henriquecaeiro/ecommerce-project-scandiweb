import React, { useEffect, useState } from "react";
import "./OrderCompleted.css";
import useDelayedLoading from "../../hooks/useDelayedLoading";
import LoadCart from "./LoadCart";

/**
 * OrderCompleted Component
 *
 * Indicates that the order was successfully stored.
 * It shows a loading indicator for at least 500ms using the custom hook,
 * then displays a success checkmark for 2 seconds before disappearing.
 *
 * Props:
 * - loading: A boolean indicating whether the order creation process is loading.
 */
const OrderCompleted: React.FC<{ loading: boolean }> = ({ loading }) => {
  // Ensures that the loading state remains true for at least 500ms.
  const showLoading = useDelayedLoading(loading, 500);
  // State to control the display of the success checkmark.
  const [showSuccessElement, setShowSuccessElement] = useState<boolean>(false);

  /**
   * When loading is complete (and the delayed loading is off),
   * display the success element for 2 seconds.
   */
  useEffect(() => {
    if (!loading && !showLoading) {
      setShowSuccessElement(true);
      const timer = setTimeout(() => {
        setShowSuccessElement(false);
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [loading, showLoading]);

  return (
    <>
      {showLoading ? (
        /* LoadingComponent */
        <LoadCart />
      ) : showSuccessElement ? (
        /* Success Checkmark */
        <div className="col-12 w-100 h-100 d-flex justify-content-center align-items-center my-5 wrapper">
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>
      ) : null}
    </>
  );
};

export default OrderCompleted;
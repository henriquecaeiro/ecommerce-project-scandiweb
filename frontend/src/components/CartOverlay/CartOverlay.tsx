import React, { useEffect, useState } from "react";
import { FaPlus, FaMinus, FaBox } from "react-icons/fa6";
import { useCart } from "../../context/CartContext";
import { handleOrder, handleQuantityClickHelper } from "../../helpers/cartOverlayHelpers";
import "./CartOverlay.css";
import { useMutation } from "@apollo/client";
import { CREATE_ORDER } from "../../apollo/mutations/orderMutation";
import { Order } from "../../interfaces/Order";
import { CartItem } from "../../interfaces/Cart";
import useDelayedLoading from "../../hooks/useDelayedLoading";
import OrderCompleted from "./OrderCompleted";

/**
 * CartOverlay Component
 *
 * Displays the items in the shopping cart as an overlay.
 * Users can update item quantities and view selected attributes.
 */
const CartOverlay: React.FC = () => {
  // Context variables
  const { isOpen, setIsOpen, cartItems, setCartItems, saveCart, cartQuantity } = useCart();
  // State to enable scrolling in the overlay after a delay.
  const [enableScroll, setEnableScroll] = useState<boolean>(false);
  // State to hold the total price of all items.
  const [totalPrice, setTotalPrice] = useState<number>(0);
  // State to store extracted text attributes, grouped by attribute name.
  const [textAttributes, setTextAttributes] = useState<Record<string, { product: string; name: string; display_value: string; value: string }[]>>({});
  // State to store extracted swatch attributes, grouped by attribute name.
  const [swatchAttributes, setSwatchAttributes] = useState<Record<string, { product: string; name: string; display_value: string; value: string }[]>>({});
  // Mutation to save the orders
  const [createOrder, { data, loading, error }] = useMutation<Order, Order>(CREATE_ORDER);
  // hook to set minumum loading time
  const showLoading = useDelayedLoading(loading, 2500)

  // Effect: Enable scrolling after overlay opens.
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setEnableScroll(true), 500);
      return () => clearTimeout(timer);
    } else {
      setEnableScroll(false);
    }
  }, [isOpen]);

  // Effect: Calculate total price whenever cartItems change.
  useEffect(() => {
    const updatedPrice = cartItems.reduce(
      (acc, cartItem) => acc + cartItem.product.price_amount * cartItem.quantity,
      0
    );
    setTotalPrice(parseFloat(updatedPrice.toFixed(2)));
  }, [cartItems])

  // Effect: Extract and group text & swatch attributes from cart items.
  useEffect(() => {
    const textAttrMap: typeof textAttributes = {};
    const swatchAttrMap: typeof swatchAttributes = {};

    cartItems.forEach((cartItem) => {
      cartItem.text_attributes.forEach((attr) => {
        if (!textAttrMap[attr.name]) {
          textAttrMap[attr.name] = [];
        }
        textAttrMap[attr.name].push({ ...attr, product: cartItem.product.name });
      });

      cartItem.swatch_attributes.forEach((attr) => {
        if (!swatchAttrMap[attr.name]) {
          swatchAttrMap[attr.name] = [];
        }
        swatchAttrMap[attr.name].push({ ...attr, product: cartItem.product.name });
      });
    });

    setTextAttributes(textAttrMap);
    setSwatchAttributes(swatchAttrMap);
  }, [cartItems]);

  useEffect(() => {

    if (!showLoading) {
      setIsOpen(false)
    }

  }, [showLoading])

  return (
    <>
      {/* Backdrop for the overlay */}
      <div className={`cart-backdrop ${isOpen ? "show" : "hide"}`}></div>

      {/* Main cart overlay container */}
      <div className={`cart-container ${isOpen ? "show" : "hide"} ${enableScroll ? "apply-scroll" : ""} z-3`} data-testid="cart-overlay">

        {showLoading ?
          <OrderCompleted loading={loading} /> :
          <>
            {/* Header displaying bag title and item count */}
            <div className="cart-header-container d-flex">
              <h4 className="cart-header">My bag, &nbsp;</h4>
              <p className="cart-total">
                {cartQuantity} {cartQuantity !== 1 ? "items" : "item"}
              </p>
            </div>

            {/* Render each cart item */}
            {cartItems.map((cartItem, index) => (
              <div
                key={`${cartItem.product.id}-${index}`}
                className="cart-item row position-relative d-flex "
              >
                {/* Product details and attributes */}
                <div className="cart-product-details d-flex flex-column col-4 col-sm-6">
                  <div className="product-item-container">
                    <p className="cart-item-name">{cartItem.product.name}</p>
                    <span className="cart-item-price">
                      {cartItem.product.currency_symbol}
                      {cartItem.product.price_amount}
                    </span>
                  </div>

                  {/* Display Text Attributes if available */}
                  {cartItem.text_attributes.length > 0 && (
                    <div className="text-container">
                      {Object.entries(textAttributes).map(([name, values]) => {
                        const kebabName = name.toLowerCase().replace(/\s+/g, "-");

                        const filteredValues = values
                          .filter((item) => item.product === cartItem.product.name)
                          .reduce((acc, curr) => {
                            if (!acc.some((attr) => attr.value === curr.value)) {
                              acc.push(curr);
                            }
                            return acc;
                          }, [] as typeof values);

                        const selectedValues = Object.keys(cartItem.text_selected).flatMap((key) =>
                          filteredValues.filter(
                            (item) =>
                              item.name === key &&
                              item.value === cartItem.text_selected[key]
                          )
                        );

                        return (
                          filteredValues.length > 0 && (
                            <div key={name} data-testid={`cart-item-attribute-${kebabName}`}>
                              <p className="cart-item-text-header">{name}:</p>
                              <div className="attribute-items-container d-flex">
                                {filteredValues.map((item, idx) => (
                                  <div
                                    key={`${cartItem.product.id}-text-${item.value}-${idx}`}
                                    className={`text-attribute-item d-flex justify-content-center align-items-center ${selectedValues.some((selectedItem) => selectedItem.value === item.value)
                                      ? "text-selected"
                                      : ""
                                      } ${idx < filteredValues.length - 1 ? "text-margin" : ""}`}
                                    data-testid={
                                      selectedValues.some((selectedItem) => selectedItem.value === item.value)
                                        ? `cart-item-attribute-${kebabName}-${kebabName}-selected`
                                        : `cart-item-attribute-${kebabName}-${kebabName}`
                                    }
                                  >
                                    <p className="text-attribute-value m-0">{item.value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        );
                      })}
                    </div>
                  )}

                  {/* Display Swatch Attributes if available */}
                  {cartItem.swatch_attributes.length > 0 && (
                    <div className="swatch-container">
                      {Object.entries(swatchAttributes).map(([name, values]) => {
                        const filteredValues = values
                          .filter((item) => item.product === cartItem.product.name)
                          .reduce((acc, curr) => {
                            if (!acc.some((attr) => attr.value === curr.value)) {
                              acc.push(curr);
                            }
                            return acc;
                          }, [] as typeof values);

                          const selectedValues = Object.keys(cartItem.swatch_selected).flatMap((key) =>
                            filteredValues.filter(
                              (item) =>
                                item.name === key &&
                                item.value === cartItem.swatch_selected[key]
                            )
                          );

                        const kebabName = name.toLowerCase().replace(/\s+/g, "-");

                        return (
                          filteredValues.length > 0 && (
                            <div key={name}>
                              <p className="cart-item-swatch-header">{name}:</p>
                              <div className="swatch-items-container d-flex align-items-center">
                                {filteredValues.map((item, idx) => (
                                  <div
                                    key={`${cartItem.product.id}-swatch-${item.value}-${idx}`}
                                    className={`swatch-attribute-item ${Object.values(cartItem.swatch_selected ?? {}).includes(item.value)
                                      ? "swatch-selected"
                                      : ""
                                      } ${idx < filteredValues.length - 1 ? "swatch-margin" : ""}`}
                                      data-testid={
                                        selectedValues.some((selectedItem) => selectedItem.value === item.value)
                                          ? `cart-item-attribute-${kebabName}-${kebabName}-selected`
                                          : `cart-item-attribute-${kebabName}-${kebabName}`
                                      }
                                  >
                                    <div
                                      className={`swatch-item ${item.value === "#FFFFFF" ? "swatch-border-item" : ""}`}
                                      style={{ backgroundColor: item.value }}
                                    ></div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        );
                      })}
                    </div>
                  )}

                  {/* Display message if no attributes are available */}
                  {cartItem.text_attributes.length === 0 && cartItem.swatch_attributes.length === 0 && (
                    <>
                      <p className="cart-item-no-attributes-header">No attributes available:</p>
                      <div className="no-items-container d-flex align-items-center justify-content-center">
                        <FaBox className="no-attributes-icon" />
                      </div>
                    </>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="quantity-container d-flex flex-column justify-content-between align-items-center  col-2">
                  <div
                    className="quantity-item-container d-flex align-items-center justify-content-center z-3"
                    onClick={() =>
                      handleQuantityClickHelper({
                        productId: cartItem.product.id,
                        action: "ADD",
                        cartItems,
                        setCartItems,
                        selectedText: cartItem.text_selected ?? {},
                        selectedSwatch: cartItem.swatch_selected ?? {}
                      })
                    }
                    data-testid="cart-item-amount-increase"
                    aria-label="ADD"
                  >
                    <FaPlus />
                  </div>
                  <span className="quantity" data-testid="cart-item-amount">
                    {cartItem.quantity}
                  </span>
                  <div
                    className="quantity-item-container d-flex align-items-center justify-content-center z-3"
                    onClick={() =>
                      handleQuantityClickHelper({
                        productId: cartItem.product.id,
                        action: "REMOVE",
                        cartItems,
                        setCartItems,
                        selectedText: cartItem.text_selected ?? {},
                        selectedSwatch: cartItem.swatch_selected ?? {}
                      })
                    }

                    data-testid="cart-item-amount-decrease"
                    aria-label="REMOVE"
                  >
                    <FaMinus />
                    <span className="visually-hidden">REMOVE</span>
                  </div>
                </div>

                {/* Product Image */}
                <div className="col-6 col-sm-4 p-0 w-auto">
                  <img
                    src={cartItem.product.image_url[0]}
                    alt={cartItem.product.name}
                    className="product-image p-0"
                  />
                </div>
              </div>
            ))}

            {/* Total Price Section */}
            <div className="total-container d-flex">
              <h4 className="total w-50">Total</h4>
              <h4 className="total-price w-50 text-end" data-testid="cart-total">
                ${totalPrice}
              </h4>
            </div>
          </>
        }
        {/* Place Order Button */}
        <div className="button-div d-flex justify-content-center align-items-center">
          <button
            className={`${cartItems.length === 0 ? "disabled" : "cart-button p-0"}`}
            onClick={() => {
              if (cartItems.length !== 0) {
                handleOrder({ orderItens: cartItems, createOrder, saveCart: (cart: CartItem[]) => saveCart(cart, "cart") }
                )
              }
            }}
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </>
  );
};

export default CartOverlay;
import React from "react";
import { CartItem } from "../interfaces/Cart";
import { AttributeResult } from "../interfaces/Attributes";
import { Product } from "../interfaces/Product";

/**
 * Toggles the selected product ID based on mouse enter/leave events.
 *
 * @param productId - The ID of the product being hovered (or null when leaving).
 * @param currentSelectedProductId - The currently selected product ID.
 * @param setSelectedProductId - The state setter for the selected product ID.
 */
export function handleMouseEnterHelper(
  productId: string | null,
  currentSelectedProductId: string | null,
  setSelectedProductId: (id: string | null) => void
): void {
  setSelectedProductId(productId === currentSelectedProductId ? null : productId);
}

/**
 * Handles the click event for adding a product to the cart.
 *
 * Constructs a new cart item from the product data and the fetched attributes,
 * then updates the cart stored in localStorage.
 *
 * @param event - The click event.
 * @param product - The product data.
 * @param textData - The fetched text attributes.
 * @param swatchData - The fetched swatch attributes.
 * @param getStoredCart - Function to retrieve the current cart from storage.
 * @param saveCart - Function to update the cart in storage.
 */
export function handleCartClickHelper(
  event: React.MouseEvent<HTMLSpanElement>,
  product: Product | undefined,
  textData: AttributeResult | undefined,
  swatchData: AttributeResult | undefined,
  getStoredCart: () => CartItem[],
  saveCart: (cart: CartItem[]) => void
): void {
  event.preventDefault();

  if (!product || !swatchData?.attributes || !textData?.attributes) return;

  const textSelectedMap: Record<string, string | number | number[]> = {};
  textData.attributes.forEach((attribute) => {
    if (!(attribute.name in textSelectedMap)) {
      textSelectedMap[attribute.name] = attribute.value;
      textSelectedMap["attributeId"] = attribute.attribute_value_id;
    }
  });

  const swatchSelectedMap: Record<string, string | number | number[]> = {};
  swatchData.attributes.forEach((attribute) => {
    if (!(attribute.name in swatchSelectedMap)) {
      swatchSelectedMap[attribute.name] = attribute.value;
      swatchSelectedMap["attributeId"] = attribute.attribute_value_id;
    }
  });

  const newItem: CartItem = {
    product: {
      id: product.id,
      name: product.name,
      in_stock: product.in_stock,
      image_url: [product.image_url[0]],
      currency_symbol: product.currency_symbol,
      price_amount: product.price_amount,
    },
    swatch_attributes: swatchData.attributes,
    text_attributes: textData.attributes,
    swatch_selected: swatchSelectedMap,
    text_selected: textSelectedMap,
    quantity: 1,
     key: `${product.id}-${Date.now()}`
  };


  const prevCart = getStoredCart();
  let updatedCart: CartItem[];

  if (prevCart.length === 0) {
    updatedCart = [newItem];
  } else {
    const existingItemIndex = prevCart.findIndex((cartItem) =>
      cartItem.product.id === newItem.product.id &&
      JSON.stringify(cartItem.swatch_selected) === JSON.stringify(newItem.swatch_selected) &&
      JSON.stringify(cartItem.text_selected) === JSON.stringify(newItem.text_selected)
    );

    if (existingItemIndex !== -1) {
      updatedCart = prevCart.map((cartItem, index) =>
        index === existingItemIndex
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedCart = [...prevCart, newItem];
    }
  }

  saveCart(updatedCart);
}
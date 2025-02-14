import { CartItem, handleOrderParams, handleQuantityClickParams } from "../interfaces/Cart";
import { Order } from "../interfaces/Order";


/**
 * Handles updating the quantity of a specific cart item.
 *
 * @param productId - The ID of the product to update.
 * @param action - "add" to increase or "remove" to decrease the quantity.
 * @param cartItems - The current array of cart items.
 * @param setCartItems - Function to update the cart items.
 */
export function handleQuantityClickHelper(params: handleQuantityClickParams): void {
  const {
    productId,
    action,
    cartItems,
    setCartItems,
    selectedText,
    selectedSwatch
  } = params

  const updatedCart = cartItems
  .map((cartItem) =>
    cartItem.product.id === productId &&
    JSON.stringify(cartItem.text_selected) === JSON.stringify(selectedText) &&
    JSON.stringify(cartItem.swatch_selected) === JSON.stringify(selectedSwatch)
      ? {
          ...cartItem,
          quantity: action === "add" ? cartItem.quantity + 1 : cartItem.quantity - 1,
        }
      : cartItem
  )
    .filter((item) => item.quantity > 0);

  setCartItems(updatedCart);
}

/**
 * Handles creating orders for each cart item.
 *
 * For each order item, this function:
 * - Initializes an array for attribute value IDs.
 * - Pushes the swatch and text attribute IDs (if available).
 * - Prepares the variables object based on the order item data.
 * - Calls the createOrder mutation with the prepared variables.
 *
 * @param params - Object containing the order items and the createOrder function.
 */
export function handleOrder(params: handleOrderParams): void {
  const { orderItens, createOrder, saveCart } = params;

  orderItens.forEach((orderItem) => {
    // Initialize the attribute IDs array for the current order item.
    const attributeValuesId: number[] = [];

    // Push the swatch attribute ID if available.
    if (orderItem.swatch_selected.attributeId !== undefined) {
      attributeValuesId.push(Number(orderItem.swatch_selected.attributeId));
    }

    // Push the text attribute ID if available.
    if (orderItem.text_selected.attributeId !== undefined) {
      attributeValuesId.push(Number(orderItem.text_selected.attributeId));
    }

    // Prepare the variables for the mutation based on the order item data.
    const variables: Order = {
      total_amount: orderItem.product.price_amount * orderItem.quantity,
      product_id: orderItem.product.id,
      quantity: orderItem.quantity,
      amount: orderItem.product.price_amount,
      attribute_value_id: attributeValuesId,
    };

    // Execute the mutation using the provided createOrder function.
    createOrder({ variables });

    saveCart([]);
  });
}
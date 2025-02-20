import { MutationFunction } from "@apollo/client";
import { Attribute, SelectedAttributes, SelectedAttributeValues } from "./Attributes";
import { Order } from "./Order";

/**
 * Represents an individual item in the shopping cart.
 */
export interface CartItem {
  /** The product details for the cart item. */
  product: {
    /** Unique identifier of the product. */
    id: string;
    /** Name of the product. */
    name: string;
    /** Indicates if the product is in stock (1 for in stock, 0 for out). */
    in_stock: number;
    /** Array of image URLs for the product. */
    image_url: string[];
    /** Currency symbol for the product's price (e.g. "$"). */
    currency_symbol: string;
    /** The price amount of the product. */
    price_amount: number;
  };
  /** Array of swatch attributes available for the product. */
  swatch_attributes: Attribute[];
  /** Selected swatch attribute values. */
  swatch_selected: SelectedAttributeValues;
  /** Selected text attribute values. */
  text_selected: SelectedAttributeValues;
  /** Array of text attributes available for the product. */
  text_attributes: Attribute[];
  /** Quantity of the product in the cart. */
  quantity: number;
  /** A unique key for the cart item, often created using the product id and a timestamp. */
  key: string;
}

/**
 * Defines the shape of the global cart context.
 */
export interface CartContextType {
  /** Indicates whether the cart overlay is open. */
  isOpen: boolean;
  /** Function to set the open/closed state of the cart overlay. */
  setIsOpen: (open: boolean) => void;
  /** The currently selected attributes (for products) from the global context. */
  selectedAttributes: SelectedAttributes;
  /** Function to update the selected attributes in the global context. */
  setSelectedAttributes: React.Dispatch<React.SetStateAction<SelectedAttributes>>;
  /** Array of cart items. */
  cartItems: CartItem[];
  /** Function to update the cart items. */
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  /**
   * Function to save the updated cart to localStorage and update the state.
   * @param updatedCart - The new array of CartItem.
   * @param key - The key used for storing the cart in localStorage.
   */
  saveCart: (updatedCart: CartItem[], key: string) => void;
  /**
   * Function to retrieve the cart from localStorage.
   * @param key - The key used for storing the cart in localStorage.
   * @returns An array of CartItem.
   */
  getStoredCart: (key: string) => CartItem[];
  /** The quantity of items in the cart. */
  cartQuantity: number;
  /** Function to update the cart quantity. */
  setCartQuantity: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Parameters for the handleQuantityClickHelper function.
 */
export interface handleQuantityClickParams {
  /** The product ID for which the quantity should be updated. */
  productId: string;
  /** Action to perform: "add" to increase, "remove" to decrease quantity. */
  action: "ADD" | "REMOVE";
  /** The current array of cart items. */
  cartItems: CartItem[];
  /** Function to update the cart items. */
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  /** The selected text attribute values for comparison. */
  selectedText: SelectedAttributeValues;
  /** The selected swatch attribute values for comparison. */
  selectedSwatch: SelectedAttributeValues;
}

/**
 * Parameters for the handleOrder function.
 */
export interface handleOrderParams {
  /** The array of cart items to be used in the order. */
  orderItens: CartItem[];
  /**
   * Mutation function to create an order.
   * Typically returned from Apollo's useMutation hook.
   */
  createOrder: MutationFunction<Order, Order>;
  /**
   * Function to save the updated cart.
   * This function should update the global cart state.
   */
  saveCart: (cart: CartItem[]) => void;
}

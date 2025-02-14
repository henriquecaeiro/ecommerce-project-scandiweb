import { AttributeResult, SelectedAttributes } from "./Attributes";
import { CartItem } from "./Cart";

/**
 * ProductParams interface
 *
 * Extends a record for URL parameters, ensuring that an "id" parameter is provided.
 */
export interface ProductParams extends Record<string, string | undefined> {
  /** The unique identifier for the product (usually passed as a route parameter). */
  id: string;
}

/**
 * Product interface
 *
 * Represents a product with its details.
 */
export interface Product {
  /** Unique product identifier. */
  id: string;
  /** Name of the product. */
  name: string;
  /** Brand of the product. */
  brand: string;
  /** Name of the category the product belongs to. */
  category_name: string;
  /** Indicates if the product is in stock (non-zero means in stock). */
  in_stock: number;
  /** Detailed description of the product. */
  description: string;
  /** Array of image URLs for the product. */
  image_url: string[];
  /** Currency symbol (e.g., "$"). */
  currency_symbol: string;
  /** Currency label (e.g., "USD"). */
  currency_label: string;
  /** Price amount of the product. */
  price_amount: number;
}

/**
 * ProductResult interface
 *
 * Represents the result returned from a product query.
 */
export interface ProductResult {
  /** Array of products returned by the query. */
  products: Product[];
}

/**
 * HandleProductParams interface
 *
 * Defines the parameters required by the handleProduct helper function.
 */
export interface HandleProductParams {
  /** The product to be processed; may be undefined. */
  product: Product | undefined;
  /** The text attributes fetched from the API. */
  textData: AttributeResult | undefined;
  /** The swatch attributes fetched from the API. */
  swatchData: AttributeResult | undefined;
  /** The selected attributes from the context. */
  selectedAttributes: SelectedAttributes;
  /** Function to retrieve the current cart from storage. */
  getStoredCart: () => CartItem[];
  /** Function to save the updated cart. */
  saveCart: (cart: CartItem[]) => void;
  /**
   * Function to update the selected attributes in the context.
   * Typically provided by React's useState hook.
   */
  setSelectedAttributes: React.Dispatch<React.SetStateAction<SelectedAttributes>>;
  /** Function to set the cart overlay's open/closed state. */
  setIsOpen: (open: boolean) => void;
  /**
   * A mutable ref object to hold a timeout ID.
   * Used for managing delayed state updates (e.g., closing the cart overlay after a delay).
   */
  timeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
}

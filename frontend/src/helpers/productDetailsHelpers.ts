import { CartItem } from "../interfaces/Cart";
import { HandleProductParams} from "../interfaces/Product";
import { SelectedAttributes} from "../interfaces/Attributes";
import { clearStringValues } from "../utils/clearStringValues";

/**
 * Handles adding the product to the cart.
 * This function checks the product and its attributes, creates a new cart item,
 * updates the cart, resets selected attributes, and opens the cart overlay after a delay.
 */
export function handleProduct(params: HandleProductParams): void {
    const {
        product,
        textData,
        swatchData,
        selectedAttributes,
        getStoredCart,
        saveCart,
        setSelectedAttributes,
        setIsOpen,
        timeoutRef,
    } = params;

    if (!product || !swatchData?.attributes || !textData?.attributes) return;

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
        swatch_selected: selectedAttributes.swatch_selected
            ? Object.fromEntries(
                Object.entries(selectedAttributes.swatch_selected).map(([key, value]) => [key, value])
            )
            : {},
        text_selected: selectedAttributes.text_selected
            ? Object.fromEntries(
                Object.entries(selectedAttributes.text_selected).map(([key, value]) => [key, value])
            )
            : {},
        quantity: 1,
         key: `${product.id}-${Date.now()}`
    };

    const prevCart = getStoredCart();
    let updatedCart: CartItem[];

    if (prevCart.length === 0) {
        updatedCart = [newItem];
    } else {
        const existingItemIndex = prevCart.findIndex(
            (cartItem) =>
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
    setSelectedAttributes((prev: SelectedAttributes) => clearStringValues(prev));

    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => setIsOpen(true), 250);
}

/**
 * Calculates the next image index.
 *
 * @param currentIndex - The current active image index.
 * @param totalImages - The total number of images.
 * @returns The next image index (cycles to 0 if at the last image).
 */
export function nextImageHelper(currentIndex: number, totalImages: number): number {
    return (currentIndex + 1) % totalImages;
}

/**
 * Calculates the previous image index.
 *
 * @param currentIndex - The current active image index.
 * @param totalImages - The total number of images.
 * @returns The previous image index (cycles to the last image if at index 0).
 */
export function prevImageHelper(currentIndex: number, totalImages: number): number {
    return currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
}
import React, { useEffect, useState, useCallback } from "react";
import { useCart } from "../../context/CartContext";
import "./CartOverlay.css";
import useCartLocal from "../../hooks/useCartLocal";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { FaBox } from "react-icons/fa";

const CartOverlay: React.FC = () => {
    const { isOpen } = useCart();
    const [cartItems, setCartItems, getStoredCart] = useCartLocal("cart", []);
    const [enableScroll, setEnableScroll] = useState<boolean>(false);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [textAttributes, setTextAttributes] = useState<Record<string, { product: string; name: string; display_value: string; value: string }[]>>({});
    const [swatchAttributes, setSwatchAttributes] = useState<Record<string, { product: string; name: string; display_value: string; value: string }[]>>({});

    const fetchCartData = useCallback(() => {
        let savedCart = getStoredCart();

        // Criar um novo array para agrupar produtos idênticos
        let groupedCart: typeof savedCart = [];

        savedCart.forEach((cartItem) => {
            const existingItemIndex = groupedCart.findIndex((item) =>
                item.product.name === cartItem.product.name &&
                JSON.stringify(item.swatch_selected) === JSON.stringify(cartItem.swatch_selected ?? {}) &&
                JSON.stringify(item.text_selected) === JSON.stringify(cartItem.text_selected ?? {})
            );


            if (existingItemIndex !== -1) {
                groupedCart[existingItemIndex].quantity += cartItem.quantity;
            } else {
                groupedCart.push({ ...cartItem });
            }
        });

        // **Evita atualizar o estado se os valores forem os mesmos**
        if (JSON.stringify(groupedCart) !== JSON.stringify(cartItems)) {
            setCartItems(groupedCart);
        }

        // **Atualiza o preço total**
        const updatedPrice = groupedCart.reduce((acc, cartItem) => acc + cartItem.product.price_amount * cartItem.quantity, 0);
        if (updatedPrice !== totalPrice) {
            setTotalPrice(parseFloat(updatedPrice.toFixed(2))); // Limita a 2 casas decimais
        }

        // **Mapeia os atributos de texto e swatch**
        const textAttributeMap: Record<string, { product: string; name: string; display_value: string; value: string }[]> = {};
        const swatchAttributeMap: Record<string, { product: string; name: string; display_value: string; value: string }[]> = {};

        groupedCart.forEach((cartItem) => {
            cartItem.text_attributes.forEach((attribute) => {
                if (!textAttributeMap[attribute.name]) {
                    textAttributeMap[attribute.name] = [];
                }

                const alreadyExists = textAttributeMap[attribute.name].some(
                    (item) => item.value === attribute.value &&
                        item.display_value === attribute.display_value &&
                        item.product === cartItem.product.name &&
                        item.name === attribute.name
                );

                if (!alreadyExists) {
                    textAttributeMap[attribute.name].push({
                        product: cartItem.product.name,
                        name: attribute.name,
                        display_value: attribute.display_value,
                        value: attribute.value,
                    });
                }
            });

            cartItem.swatch_attributes.forEach((attribute) => {
                if (!swatchAttributeMap[attribute.name]) {
                    swatchAttributeMap[attribute.name] = [];
                }

                const alreadyExists = swatchAttributeMap[attribute.name].some(
                    (item) => item.value === attribute.value &&
                        item.display_value === attribute.display_value &&
                        item.product === cartItem.product.name &&
                        item.name === attribute.name
                );

                if (!alreadyExists) {
                    swatchAttributeMap[attribute.name].push({
                        product: cartItem.product.name,
                        name: attribute.name,
                        display_value: attribute.display_value,
                        value: attribute.value,
                    });
                }
            });
        });

        // **Evita atualização desnecessária do estado**
        if (JSON.stringify(swatchAttributeMap) !== JSON.stringify(swatchAttributes)) {
            setSwatchAttributes(swatchAttributeMap);
        }
        if (JSON.stringify(textAttributeMap) !== JSON.stringify(textAttributes)) {
            setTextAttributes(textAttributeMap);
        }

    }, [cartItems, totalPrice, getStoredCart]); // Reduzi as dependências

    // **UseEffect atualizado**
    useEffect(() => {

        fetchCartData();

        // Escuta o evento global "cartUpdated" para atualizar os dados dinamicamente
        window.addEventListener("cartUpdated", fetchCartData);

        return () => {
            window.removeEventListener("cartUpdated", fetchCartData);
        };
    }, [fetchCartData]); // Garantindo que só seja acionado quando necessário


    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setEnableScroll(true), 500);
            return () => clearTimeout(timer);
        } else {
            setEnableScroll(false);
        }
    }, [isOpen]);

    const handleQuantityClick = (productId: string, selectedText: string[], selectedSwatch: string[], action: string) => {
        const cartItems = getStoredCart();

        const productIndex = cartItems.findIndex(
            (cartItem) =>
                cartItem.product.id === productId &&
                JSON.stringify(Object.values(cartItem.text_selected)) === JSON.stringify(selectedText) &&
                JSON.stringify(Object.values(cartItem.swatch_selected)) === JSON.stringify(selectedSwatch)
        );

        if (productIndex !== -1) {
            if (action === "add") {
                cartItems[productIndex].quantity += 1;
            } else if (action === "remove" && cartItems[productIndex].quantity > 1) {
                cartItems[productIndex].quantity -= 1;
            } else if (action === "remove" && cartItems[productIndex].quantity === 1) {
                cartItems.splice(productIndex, 1); // Remove item se a quantidade for 1
            }

            localStorage.setItem("cart", JSON.stringify(cartItems));
            window.dispatchEvent(new Event("cartUpdated"));
        }
    };

    return (
        <>
            <div className={`cart-backdrop ${isOpen ? "show" : "hide"}`}></div>

            <div className={`cart-container ${isOpen ? "show" : "hide"} ${enableScroll && "apply-scroll"} z-3`}>
                <div>
                    <div className="cart-header-container d-flex">
                        <h4 className="cart-header">My bag, &nbsp;</h4>
                        <p className="cart-total">{cartItems.length} {cartItems.length !== 1 ? "items" : "item"}</p>
                    </div>

                    {cartItems.map((cartItem, index) => (
                        <div key={`${cartItem.product.id}-${cartItem.text_selected}-${cartItem.swatch_selected}-${index}`}
                            className="cart-item row position-relative">

                            <div className="cart-product-details p-0 d-flex flex-column col-6">
                                <div className="product-item-container">
                                    <p className="cart-item-name">{cartItem.product.name}</p>
                                    <span className="cart-item-price">
                                        {cartItem.product.currency_symbol}
                                        {cartItem.product.price_amount}
                                    </span>
                                </div>

                                {cartItem.text_attributes.length > 0 &&
                                    <div className="attribute-container">
                                        {Object.entries(textAttributes)
                                            .map(([name, values]) => {
                                                // Transforma o nome do atributo para kebab-case
                                                const kebabName = name.toLowerCase().replace(/\s+/g, "-");

                                                const filteredValues = values.filter(item => item.product === cartItem.product.name);

                                                // Obtém os atributos de texto selecionados para o produto específico
                                                const selectedValues = Object.keys(cartItem.text_selected)
                                                    .map((key) => {
                                                        return values.filter(item =>
                                                            item.product === cartItem.product.name &&
                                                            item.name === key &&
                                                            item.value === cartItem.text_selected[key]
                                                        );
                                                    })
                                                    .filter(item => item.length > 0) // Remove arrays vazios
                                                    .flat(); // Achata o array

                                                return filteredValues.length > 0 && (
                                                    <div key={name} data-testid={`cart-item-attribute-${kebabName}`}>
                                                        <p className="cart-item-text-header">{name}:</p>
                                                        <div className="attribute-items-container d-flex">
                                                            {filteredValues.map((item, idx) => (
                                                                <div
                                                                    key={`${cartItem.product.id}-text-${item.value}-${idx}`}
                                                                    className={`text-attribute-item d-flex justify-content-center align-items-center 
                                                                                            ${selectedValues.some(selectedItem => selectedItem.value === item.value) ? "text-selected" : ""}
                                                                                            ${idx < filteredValues.length - 1 ? "text-margin" : ""}`}
                                                                    data-testid={
                                                                        selectedValues.some(selectedItem => selectedItem.value === item.value)
                                                                            ? `cart-item-attribute-${kebabName}-${item.value}-selected`
                                                                            : `cart-item-attribute-${kebabName}-${item.value}`
                                                                    }
                                                                >
                                                                    <p className="text-attribute-value m-0">{item.value}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                }

                                {cartItem.swatch_attributes.length > 0 &&
                                    <div className="swatch-container">
                                        {Object.entries(swatchAttributes).map(([name, values]) => {
                                            // Filtra apenas os valores do produto atual
                                            const filteredValues = values.filter(item => item.product === cartItem.product.name);

                                            return filteredValues.length > 0 && (
                                                <div key={name}>
                                                    <p className="cart-item-swatch-header">{name}:</p>
                                                    <div className="swatch-items-container d-flex align-items-center">
                                                        {filteredValues.map((item, idx) => (
                                                            <div key={`${cartItem.product.id}-swatch-${item.value}-${idx}`}
                                                                className={`swatch-attribute-item ${Object.values(cartItem.swatch_selected ?? {}).includes(item.value) ||
                                                                    (Object.keys(cartItem.swatch_selected ?? {}).length === 0 && idx === 0) ? "swatch-selected" : ""}                                                                
                                                                                        ${idx < filteredValues.length - 1 ? "swatch-margin" : ""}`}>
                                                                <div className={`swatch-item ${item.value === "#FFFFFF" ? "swatch-border-item" : ""}`}
                                                                    style={{ backgroundColor: item.value }}>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                }

                                {cartItem.text_attributes.length === 0 && cartItem.swatch_attributes.length === 0 &&
                                    <>
                                        <p className="cart-item-no-attributes-header">No attributes available:</p>
                                        <div className="no-items-container d-flex align-items-center justify-content-center">
                                                <FaBox className="no-attributes-icon"/>
                                        </div>
                                    </>
                                }

                            </div>

                            {/* Botões de controle de quantidade */}
                            <div className="quantity-container d-flex flex-column justify-content-between align-items-center col-2">
                                <div
                                    className="quantity-item-container d-flex align-items-center justify-content-center z-3"
                                    onClick={() => handleQuantityClick(cartItem.product.id, Object.values(cartItem.text_selected ?? {}),
                                        Object.values(cartItem.swatch_selected ?? {}), "add")}
                                    data-testid="cart-item-amount-increase"
                                >
                                    <FaPlus />
                                </div>
                                <span className="quantity" data-testid="cart-item-amount">{cartItem.quantity}</span>
                                <div
                                    className="quantity-item-container d-flex align-items-center justify-content-center z-3"
                                    onClick={() => handleQuantityClick(cartItem.product.id, Object.values(cartItem.text_selected ?? {}),
                                        Object.values(cartItem.swatch_selected ?? {}), "remove")}
                                    data-testid="cart-item-amount-decrease"
                                >
                                    <FaMinus />
                                </div>
                            </div>

                            {/* Imagem do Produto */}
                            <img src={cartItem.product.image_url[0]}
                                alt={cartItem.product.name}
                                className="product-image p-0 col-4" />
                        </div>
                    ))}

                    {/* Total do carrinho */}
                    <div className="total-container d-flex">
                        <h4 className="total w-50">Total</h4>
                        <h4 className="total-price w-50 text-end" data-testid="cart-total">${totalPrice}</h4>
                    </div>

                    {/* Botão de adicionar ao carrinho */}
                    <div className="button-div d-flex justify-content-center align-items-center ">
                        <button className={`${cartItems.length === 0 ? "disabled" : "cart-button p-0"}`} data-testid="add-to-cart">
                            ADD TO CART
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartOverlay;
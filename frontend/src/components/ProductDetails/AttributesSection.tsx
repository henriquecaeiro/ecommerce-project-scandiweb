import React, { useEffect, useState, useRef, useCallback } from "react";
import "./AttributeSection.css";
import { useCart } from "../../context/CartContext";
import { AttributeProps, SelectedAttributes, SelectedAttributeValues } from "../../interfaces/Attributes";



const AttributesSection: React.FC<AttributeProps> = ({
  title = "",
  attributes,
  multiple,
}) => {
  // Access selectedAttributes, setter, and cartItems from context
  const { selectedAttributes, setSelectedAttributes, cartItems } = useCart();

  // If no attributes are provided, do not render the component
  if (!attributes || attributes.length === 0) return null;

  // State to track the index of the currently selected attribute
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Using useRef to track the previous cart quantity for comparison (avoids extra re-renders)
  const prevCartQuantityRef = useRef<number>(0);

  // Effect to check if the selected attributes are effectively empty and reset the selection if needed
  useEffect(() => {
    if (!selectedAttributes) return;

    const totalTextAttributes = selectedAttributes.text_selected ? Object.keys(selectedAttributes.text_selected).length : 0;
    const totalSwatchAttributes = selectedAttributes.swatch_selected ? Object.keys(selectedAttributes.swatch_selected).length : 0;

    const allTextEmpty = totalTextAttributes > 1 && Object.values(selectedAttributes.text_selected).every((value) => value === " ");

    const allSwatchEmpty = totalSwatchAttributes > 1 && Object.values(selectedAttributes.swatch_selected).every((value) => value === " ");

    if ((totalTextAttributes > 0 && allTextEmpty) || (totalSwatchAttributes > 0 && allSwatchEmpty)) {
      setSelectedIndex(null);
    }

  }, [selectedAttributes, attributes]);

  // Effect to monitor changes in the cart items and reset the selection if the cart quantity increases
  useEffect(() => {
    const currentCartQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    if (currentCartQuantity > prevCartQuantityRef.current && selectedIndex !== null) {
      setSelectedIndex(null);
    }

    // Update the ref with the latest cart quantity for future comparisons
    prevCartQuantityRef.current = currentCartQuantity;
  }, [cartItems, selectedIndex]);

  // Handler for when an attribute is selected
  const handleSelected = useCallback(
    (
      index: number,
      attributeName: string,
      attributeValue: string,
      attributeId: number[],
      type: "swatch_selected" | "text_selected"
    ) => {
      setSelectedIndex(index);

      setSelectedAttributes((prev: SelectedAttributes) => ({
        ...prev,
        [type]: {
          ...(prev[type] || {}), 
          [attributeName]: attributeValue, attributeId
        },
      }));
    },
    [setSelectedAttributes]
  );

  return (
    <div
      className={`attribute-div d-flex ${multiple ? "multiple" : "single"}`}
      data-testid={`product-attribute-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <h2 className="attribute-title">{title}:</h2>
      <div className="attribute-items d-flex">
        {attributes.map((attribute, index) =>
          attribute.name === "Color" ? (
            <div
              key={`${attribute.name}-${attribute.value}-${index}`} 
              className={`me-2 ${index === selectedIndex ? "item-selected" : ""
                }`}
            >
              <div
                className={`attribute-item ${index === selectedIndex ? "attribute-margin" : ""
                  } ${attribute.value === "#FFFFFF" ? "border-item" : ""
                  }`}
                onClick={() =>
                  handleSelected(index, attribute.name, attribute.value, attribute.attribute_value_id, "swatch_selected")
                }
                style={{ backgroundColor: attribute.value }}
              />
            </div>
          ) : (
            <div
              key={`${attribute.name}-${attribute.value}-${index}`} 
              className={`attribute-text-container d-flex justify-content-center align-items-center me-2 ${index === selectedIndex ? "attribute-selected" : ""
                }`}
              onClick={() =>
                handleSelected(index, attribute.name, attribute.value, attribute.attribute_value_id, "text_selected")
              }
            >
              <p className="attribute-text m-0">{attribute.value}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AttributesSection;
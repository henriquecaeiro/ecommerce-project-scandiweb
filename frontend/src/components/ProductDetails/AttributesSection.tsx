import React, { useEffect, useState } from "react";
import "./AttributeSection.css";
import { useCart } from "../../context/CartContext";

interface Attribute {
    name: string;
    display_value: string;
    value: string;
}

interface AttributeProps {
    title: string | undefined;
    attributes: Attribute[] | undefined;
    multiple: boolean;
    product_id: string;
}

const AttributesSection: React.FC<AttributeProps> = ({ title, attributes, multiple, product_id }) => {

    const { selectedAttributes, setSelectedAttributes } = useCart(); // Pegando do contexto

    if (!attributes || attributes.length === 0) return null;

    const [isSelected, setIsSelected] = useState<number | null>(null);

    useEffect(() => {

        if (selectedAttributes?.text) {
            const allTextAttributesEmpty = Object.values(selectedAttributes.text).every(value => value === "");

            if (allTextAttributesEmpty) {
                setIsSelected(null); 
            }
        } 

    }, [selectedAttributes, attributes]);

    const handleSelected = (index: number, attribute_name: string, attribute_value: string, type: "swatch" | "text") => {
        // **Atualiza o atributo selecionado normalmente**
        setIsSelected(index);

        setSelectedAttributes((prev) => ({
            ...prev,
            [type]: {
                ...(prev[type] || {}), // Garante que prev[type] seja um objeto válido
                [attribute_name]: attribute_value, // Salva o atributo selecionado sem sobrescrever os outros
            },
        }));
    };



    return (
        <div className={`attribute-div d-flex ${multiple ? "multiple" : "single"}`} data-testid={`product-attribute-${title?.toLowerCase().replace(/\s+/g, "-")}`}>
            <h2 className="attribute-title">{title}:</h2>
            <div className="attribute-items d-flex">
                {attributes.map((attribute, index) => (
                    attribute?.name === "Color" ? (
                        <div key={attribute.value} className={`me-2 ${index === isSelected ? "item-selected" : ""}`}>
                            <div
                                className={`attribute-item ${index === isSelected ? "attribute-margin" : ""} ${attribute.value === "#FFFFFF" && "border-item"}`}
                                onClick={() => handleSelected(index, attribute.name, attribute.value, "swatch")}
                                style={{ backgroundColor: attribute.value }}>
                            </div>
                        </div>
                    ) : (
                        <div
                            key={attribute.value} // Agora usa um identificador único
                            className={`attribute-text-container d-flex justify-content-center align-items-center me-2 ${index === isSelected && "attribute-selected"}`}
                            onClick={() => handleSelected(index, attribute.name, attribute.value, "text")}>
                            <p className="attribute-text m-0">{attribute.value}</p>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default AttributesSection;

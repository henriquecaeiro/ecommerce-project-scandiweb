import React, { useState } from "react";
import "./AttributeSection.css";

interface Attribute {
    name: string;
    display_value: string;
    value: string;
}

interface AttributeProps {
    title: string | undefined;
    attributes: Attribute[] | undefined;
    multiple: boolean;
}

const AttributesSection: React.FC<AttributeProps> = ({ title, attributes, multiple }) => {
    if (!attributes || attributes.length === 0) return null;

    const [isSelected, setIsSelected] = useState<number | null>(null);

    const handleSelected = (index: number) => {
        setIsSelected(index === isSelected ? null : index);
    };

    return (
        <div className={`attribute-div d-flex ${multiple ? "multiple" : ""}`} data-testid={`product-attribute-${title?.toLowerCase().replace(/\s+/g, "-")}`}>
            <h2 className="attribute-title">{title}:</h2>
            <div className="attribute-items d-flex">
                {attributes.map((attribute, index) => (
                    attribute?.name === "Color" ? (
                        <div key={attribute.value} className={`me-2 ${index === isSelected ? "item-selected" : ""}`}>
                            <div
                                className={`attribute-item ${index === isSelected ? "attribute-margin" : ""} ${attribute.value === "#FFFFFF" ? "border-item" : ""}`}
                                onClick={() => handleSelected(index)}
                                style={{ backgroundColor: attribute.value }}>
                            </div>
                        </div>
                    ) : (
                        <div
                            key={attribute.value} // Agora usa um identificador único
                            className={`attribute-text-container d-flex justify-content-center align-items-center me-2 ${index === isSelected ? "attribute-selected" : ""}`}
                            onClick={() => handleSelected(index)}>
                            <p className="attribute-text m-0">{attribute.value}</p>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default AttributesSection;

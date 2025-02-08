export interface Attribute {
    name: string
    display_value: string;
    value: string;
}

export interface AttributeResult {
    attributes: Attribute[];
}
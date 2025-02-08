import { Attribute } from "./Attributes";
import { Product } from "./Product";

export interface CartItem {
    product: {
        id: string,
        name: string,
        in_stock: number,
        image_url: string[],
        currency_symbol: string,
        price_amount: number
    };
    swatch_attributes: Attribute[];
    swatch_selected: Record<string, string>;
    text_selected: Record<string, string>;
    text_attributes: Attribute[];
    quantity: number;
    key: string;
}
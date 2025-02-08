export interface ProductParams extends Record<string, string | undefined> {
    id: string;
}

export interface Product {
    id: string;
    name: string;
    in_stock: number;
    description: string;
    image_url: string[];
    currency_symbol: string;
    currency_label: string;
    price_amount: number;
    brand: string;
    category_name: string;
}

export interface ProductResult {
    products: Product[];
}
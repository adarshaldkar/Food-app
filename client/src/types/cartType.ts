import { MenuItem } from "./restaurantType";

export interface CartItem extends MenuItem { 
    quantity:number;
    restaurantId?: string;
    restaurantName?: string;
}
export type CartState = {
    cart:CartItem[];
    addToCart:(item:MenuItem, restaurantId?: string, restaurantName?: string) => void;
    clearCart: () => void;
    removeFromTheCart: (id:string) => void;
    incrementQuantity: (id:string) => void;
    decrementQuantity: (id:string) => void;
    debugCart: () => CartItem[];
}

import React from "react";
import { useCart } from "../../../content/CartContext";
import './CartItem.css';

import { FaTimes } from 'react-icons/fa';

const CartItem = ({ item }) => {
    const { updateItemQuantity, removeItemFromCart } = useCart();

    const handleQuantityChange = (amount) => {
        updateItemQuantity(item.slug, item.language, item.quantity + amount);
    };

    const handleRemove = () => {
        removeItemFromCart(item.slug, item.language);
    };

    const priceNumber = parseFloat(String(item.price).replace(/[^0-9.]/g, ''));
    const itemTotal = priceNumber * item.quantity;

    return (
        <div className="cart-item">
            <button onClick={handleRemove} className="remove-item-btn">
                <FaTimes />
            </button>
            <img src={item.coverImage} alt={item.title} className="cart-item-image" />
            <div className="cart-item-details">
                <p className="cart-item-title">{item.title} ({item.language.toUpperCase()})</p>
                <p className="cart-item-description">{item.shortDescription}</p>
            </div>
            <div className="cart-item-price">{priceNumber.toFixed(2)}</div>
            <div className="cart-item-quantity">
                <button onClick={() => handleQuantityChange(-1)} disabled={item.quantity <= 1}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>
            <div className="cart-item-total">{itemTotal.toFixed(2)}</div>
        </div>
    );
};

export default CartItem;
import React from "react";
import { Link, useNavigate, useLocation} from "react-router-dom";
import { useCart } from "../../content/CartContext";
import { useAuth } from "../../content/AuthContext";
import { db } from "../../firebase";
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import CartItem from "../../components/cart/CartItem/CartItem";
import './CartPage.css';

const CartPage = () => {
    console.log("[CartPage] Component RENDERED");
    const { cartItems, getCartTotal } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();

    const handlePurchase = async () => {
        console.log("[CartPage] handlePurchase called");
        if (!currentUser) {
            alert("Будь ласка, увійдіть або зареєструйтесь, щоб продовжити оформлення замовлення.");
            navigate('/registrate', { state: { from: location } });
            return;
        }

        const totalAmount = getCartTotal();

        if (totalAmount <= 0) {
            alert("Ваша корзина пуста");
            return;
        }

        const description = `оплата заказа из ${cartItems.length} позиций на сайте`;
        const orderId = `YAS_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        console.log("[CartPage] Generated orderId:", orderId);

        const orderFirestoreData = {
            orderId: orderId, 
            userId: currentUser.uid, 
            userEmail: currentUser.email, 
            items: cartItems.map(item => ({ 
                slug: item.slug,
                language: item.language,
                title: item.title,
                quantity: item.quantity,
                price: parseFloat(item.price), 
                coverImage: item.coverImage || null, 
            })),
            totalAmount: parseFloat(totalAmount.toFixed(2)), 
            currency: "UAH", 
            status: "pending_payment", 
            paymentMethod: "liqpay", 
            createdAt: serverTimestamp(), 
            updatedAt: serverTimestamp(), 
        };
        console.log("[CartPage] orderFirestoreData prepared:", orderFirestoreData);

        try {
            const orderDocRef = doc(db, "orders", orderId); 
            console.log("[CartPage] orderDocRef created for Firestore.");
            await setDoc(orderDocRef, orderFirestoreData);
            console.log("Заказ успешно создан в Firestore с ID:", orderId);

            const orderDataForCheckout = {
                amount: totalAmount,
                description: description,
                orderId: orderId,
            };

            localStorage.setItem('processingOrderId', orderId);
            console.log("[CartPage] Saved orderId to localStorage:", orderId);

            console.log("[CartPage] Перед вызовом navigate на /checkout/liqpay. State:", { state: { orderData: orderDataForCheckout } });
            navigate('/checkout/liqpay', { state: { orderData: orderDataForCheckout } });

        } catch (error) {
            console.error("[CartPage] Ошибка при создании заказа в Firestore или перенаправлении:", error);            // Здесь можно показать пользователю более дружелюбное сообщение об ошибке
            alert("Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз. Если проблема повторится, свяжитесь с поддержкой.");
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-page-container epmty-cart">
                <h2>Your Cart is Empty</h2>
                <p>Looks like you haven't added anything you your cart yet.</p>
                <Link to="/studying" className='continue-shopping-btn'>
                    Continue Shopping
                </Link>
            </div >
        );
    }

    return (
        <div className="cart-page-container">
            <h1>Your Cart</h1>
            <div className="cart-header">
                <span className="header-stuff">Stuff</span>
                <span className="header-price">Price</span>
                <span className="header-amount">Amount</span>
                <span className="header-total">Total</span>
            </div>
            <div className="cart-items-list">
                {cartItems.map(item => (
                    <CartItem key={`${item.slug}-${item.language}`} item={item} />
                ))}
            </div>
            <div className="cart-summary">
                <div className="cart-total-amount">
                    <span>Total</span>
                    <span>{getCartTotal().toFixed(2)} грн</span>
                </div>
                <button onClick={handlePurchase} className="purchase-btn-cart">
                    Purchase
                </button>
            </div>
        </div>
    );
};

export default CartPage;
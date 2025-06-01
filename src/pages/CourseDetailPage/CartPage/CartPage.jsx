import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../content/CartContext";
import CartItem from "../../../components/cart/CartItem/CartItem";
import { useAuth } from "../../../content/AuthContext";
import { db } from "../../../firebase";
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import './CartPage.css';

const CartPage = () => {
    const { cartItems, getCartTotal } = useCart();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const handlePurchase = async () => {
        const totalAmount = getCartTotal();

        if (totalAmount <= 0) {
            alert("Ваша корзина пуста");
            return;
        }

        const description = `оплата заказа из ${cartItems.length} позиций на сайте`;
        const orderId = `YAS_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        const orderFirestoreData = {
            orderId: orderId, // Можно дублировать ID документа для удобства запросов
            userId: currentUser ? currentUser.uid : null, // ID пользователя, если он авторизован
            userEmail: currentUser ? currentUser.email : null, // Email пользователя для уведомлений
            items: cartItems.map(item => ({ // Сохраняем детали товаров в заказе
                slug: item.slug,
                language: item.language,
                title: item.title,
                quantity: item.quantity,
                price: parseFloat(item.price), // Убедимся, что цена это число
                coverImage: item.coverImage || null, // Добавим изображение для удобства
            })),
            totalAmount: parseFloat(totalAmount.toFixed(2)), // Общая сумма заказа
            currency: "UAH", // Валюта
            status: "pending_payment", // Начальный статус заказа
            paymentMethod: "liqpay", // Метод оплаты
            createdAt: serverTimestamp(), // Время создания заказа (серверное время)
            updatedAt: serverTimestamp(), // Время последнего обновления (серверное время)
            // Можно добавить и другие поля, если они нужны (например, информация о доставке, если применимо)
        };

       try {
            // 7. Сохраняем заказ в Firestore
            // Создаем ссылку на документ с именем, равным orderId, в коллекции 'orders'
            const orderDocRef = doc(db, "orders", orderId);
            await setDoc(orderDocRef, orderFirestoreData);
            console.log("Заказ успешно создан в Firestore с ID:", orderId);

            // 8. Формируем данные для передачи на страницу LiqPay Checkout
            const orderDataForCheckout = {
                amount: totalAmount,
                description: description,
                orderId: orderId, // Используем тот же orderId, что и для документа Firestore
            };

            // 9. Перенаправляем на страницу оплаты
            navigate('/checkout/liqpay', { state: { orderData: orderDataForCheckout } });

        } catch (error) {
            console.error("Ошибка при создании заказа в Firestore или перенаправлении:", error);
            // Здесь можно показать пользователю более дружелюбное сообщение об ошибке
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
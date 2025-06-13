// src/content/CartContext.jsx

import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);
const LOCAL_STORAGE_CART_KEY = 'anonymousCartItems';

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);
    const { currentUser, loadingAuthState } = useAuth();

    // Функція збереження кошика (без змін)
    const saveCart = useCallback(async (uid, items) => {
        if (!uid) {
            localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(items));
            return;
        }
        
        try {
            await setDoc(doc(db, 'userCarts', uid), {
                items,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Ошибка сохранения корзины:", error);
        }
    }, []);

    // Нова функція, яка завантажує і об'єднує кошики
    const loadCartAndMerge = useCallback(async (user) => {
        setLoadingCart(true);
        try {
            // 1. Завжди зчитуємо локальний кошик
            const localCartRaw = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
            const localItems = localCartRaw ? JSON.parse(localCartRaw) : [];

            if (user) {
                // Користувач залогінений, починаємо процес об'єднання
                const docRef = doc(db, 'userCarts', user.uid);
                const docSnap = await getDoc(docRef);
                const firestoreItems = docSnap.exists() ? docSnap.data().items || [] : [];

                // 2. Логіка об'єднання
                const mergedItems = [...firestoreItems];
                if (localItems.length > 0) {
                    localItems.forEach(localItem => {
                        const existingIndex = mergedItems.findIndex(
                            item => item.slug === localItem.slug && item.language === localItem.language
                        );
                        if (existingIndex !== -1) {
                            // Якщо товар вже є, додаємо кількість
                            mergedItems[existingIndex].quantity += localItem.quantity;
                        } else {
                            // Якщо товару немає, просто додаємо його
                            mergedItems.push(localItem);
                        }
                    });
                    
                    // 3. Зберігаємо об'єднаний кошик у Firestore і очищуємо локальний
                    await saveCart(user.uid, mergedItems);
                    localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
                    console.log("Local cart merged into Firestore cart.");
                }
                
                setCartItems(mergedItems);

            } else {
                // Користувач не залогінений, просто завантажуємо локальний кошик
                setCartItems(localItems);
            }
        } catch (error) {
            console.error("Помилка завантаження/об'єднання кошика:", error);
            setCartItems([]);
        } finally {
            setLoadingCart(false);
        }
    }, [saveCart]); // Залежність тільки від saveCart

    // Цей useEffect викликає об'єднання при зміні статусу користувача
    useEffect(() => {
        if (!loadingAuthState) {
            loadCartAndMerge(currentUser);
        }
    }, [loadingAuthState, currentUser, loadCartAndMerge]);

    // Цей useEffect зберігає кошик при його зміні
    useEffect(() => {
        if (loadingCart || loadingAuthState) return;

         const timer = setTimeout(() => {
            saveCart(currentUser?.uid, cartItems);
        }, 500);
        return () => clearTimeout(timer);
    }, [cartItems, currentUser, loadingCart, loadingAuthState, saveCart]);

    const addItemToCart = useCallback((product) => {
        setCartItems(prev => {
            const existing = prev.find(item => 
                item.slug === product.slug && 
                item.language === product.language
            );
            
            return existing 
                ? prev.map(item => 
                    item.slug === product.slug && item.language === product.language
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                  )
                : [...prev, { ...product, quantity: 1 }];
        });
    }, []);

    const removeItemFromCart = useCallback((slug, language) => {
        setCartItems(prev => prev.filter(item => 
            !(item.slug === slug && item.language === language)
        ));
    }, []);

    const updateItemQuantity = useCallback((slug, language, quantity) => {
        setCartItems(prev => prev.map(item => 
            item.slug === slug && item.language === language
                ? { ...item, quantity: Math.max(1, quantity) }
                : item
        ).filter(item => item.quantity > 0));
    }, []);

   const clearCart = useCallback(async () => {
        setCartItems([]);
        // Очищуємо і в Firestore, і в localStorage для надійності
        if (currentUser) {
            await saveCart(currentUser.uid, []);
        } else {
            localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
        }
    }, [currentUser, saveCart]);

    const getCartTotal = () => cartItems.reduce(
        (total, item) => total + (parseFloat(String(item.price).replace(/[^0-9.]/g, '')) * item.quantity), 0
    );

    const getTotalItems = () => cartItems.reduce(
        (total, item) => total + item.quantity, 0
    );

    const value = {
        cartItems,
        loadingCart,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        clearCart,
        getTotalItems,
        getCartTotal
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
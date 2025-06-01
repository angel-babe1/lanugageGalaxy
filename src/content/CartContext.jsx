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

    const loadCart = useCallback(async () => {
        setLoadingCart(true);
        try {
            if (currentUser) {
                // Загрузка из Firestore
                const docSnap = await getDoc(doc(db, 'userCarts', currentUser.uid));
                if (docSnap.exists()) {
                    setCartItems(docSnap.data().items || []);
                } else {
                    // Если корзины нет - создаем пустую
                    await saveCart(currentUser.uid, []);
                }
            } else {
                // Загрузка из localStorage
                const localCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
                setCartItems(localCart ? JSON.parse(localCart) : []);
            }
        } catch (error) {
            console.error("Ошибка загрузки корзины:", error);
            setCartItems([]);
        } finally {
            setLoadingCart(false);
        }
    }, [currentUser, saveCart]);

    // Создаем документ корзины при первом входе пользователя
    // const initializeUserCart = useCallback(async (uid) => {
    //     const cartDocRef = doc(db, 'userCarts', uid);
    //     try {
    //         const docSnap = await getDoc(cartDocRef);
    //         if (!docSnap.exists()) {
    //             await setDoc(cartDocRef, {
    //                 items: [],
    //                 createdAt: serverTimestamp(),
    //                 updatedAt: serverTimestamp()
    //             });
    //             console.log("New cart created for user:", uid);
    //         }
    //     } catch (error) {
    //         console.error("Error initializing user cart:", error);
    //     }
    // }, []);

    // const saveCartToFirestore = useCallback(async (uid, items) => {
    //     if (!uid) return;
    //     const cartDocRef = doc(db, 'userCarts', uid);
    //     try {
    //         await setDoc(cartDocRef, {
    //             items,
    //             updatedAt: serverTimestamp()
    //         }, { merge: true });
    //     } catch (error) {
    //         console.error("Error saving cart:", error);
    //     }
    // }, []);

    // const loadCart = useCallback(async (user) => {
    //     setLoadingCart(true);
    //     try {
    //         if (user) {
    //             // Для авторизованного пользователя
    //             await initializeUserCart(user.uid);
    //             const cartDocRef = doc(db, 'userCarts', user.uid);
    //             const docSnap = await getDoc(cartDocRef);
                
    //             if (docSnap.exists()) {
    //                 setCartItems(docSnap.data().items || []);
    //             }
    //         } else {
    //             // Для анонимного пользователя
    //             const localCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    //             setCartItems(localCart ? JSON.parse(localCart) : []);
    //         }
    //     } catch (error) {
    //         console.error("Error loading cart:", error);
    //         setCartItems([]);
    //     } finally {
    //         setLoadingCart(false);
    //     }
    // }, [initializeUserCart]);

    // Загрузка корзины при изменении пользователя
    useEffect(() => {
        if (!loadingAuthState) {
            loadCart();
        }
    }, [loadingAuthState, loadCart]);

    // Сохранение корзины при изменениях
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
        if (currentUser) {
            await saveCart(currentUser.uid, []);
        } else {
            localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
        }
    }, [currentUser, saveCart]);

    const getCartTotal = () => cartItems.reduce(
        (total, item) => total + (parseFloat(item.price) * item.quantity), 0
    );

    const getTotalItems = () => cartItems.reduce(
        (total, item) => total + item.quantity, 0
    );

    return (
        <CartContext.Provider value={{
            cartItems,
            loadingCart,
            addItemToCart,
            removeItemFromCart,
            updateItemQuantity,
            clearCart,
            getTotalItems: () => cartItems.reduce((total, item) => total + item.quantity, 0),
            getCartTotal: () => cartItems.reduce((total, item) => 
                total + (parseFloat(item.price) * item.quantity), 0)
        }}>
            {children}
        </CartContext.Provider>
    );
};
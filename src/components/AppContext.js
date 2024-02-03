'use client';
import {SessionProvider} from "next-auth/react";
import {createContext, useEffect, useState} from "react";
import toast from "react-hot-toast";

export const CartContext = createContext({});

export function cartProductPrice(cartProduct) {
  let price = cartProduct.basePrice;
  if (cartProduct.size) {
    price += cartProduct.size.price;
  }
  if (cartProduct.extras?.length > 0) {
    for (const extra of cartProduct.extras) {
      price += extra.price;
    }
  }
  return price;
}

export function AppProvider({children}) {
  const [cartProducts,setCartProducts] = useState([]);

  const ls = typeof window !== 'undefined' ? window.localStorage : null;

  useEffect(() => {
    console.log('cart items === > ' + ls.getItem('cart'))
    if (ls && ls.getItem('cart')) {
      setCartProducts( JSON.parse( ls.getItem('cart') ) );
    }
  }, []);

  function clearCart() {
    setCartProducts([]);
    saveCartProductsToLocalStorage([]);
  }

  function removeCartProduct(indexToRemove) {
    console.log('cart to delete === ' + indexToRemove)
    setCartProducts(prevCartProducts => {
      console.log('prvious cart products  === ' + JSON.stringify(prevCartProducts))
      const newCartProducts = prevCartProducts
      .filter((product) => product._id !== indexToRemove);
      saveCartProductsToLocalStorage(newCartProducts);
      return newCartProducts;
    });
    toast.success('Product removed');
  }

  function saveCartProductsToLocalStorage(cartProducts) {
    if (ls) {
      ls.setItem('cart', JSON.stringify(cartProducts));
    }
  }

  function addToCart(product, size=null, extras=[]) {
    setCartProducts(prevProducts => {
      const cartProduct = {...product, size, extras};
      const newProducts = [...prevProducts, cartProduct];
      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
  }

  return (
    <SessionProvider>
      <CartContext.Provider value={{
        cartProducts, setCartProducts,
        addToCart, removeCartProduct, clearCart,
      }}>
        {children}
      </CartContext.Provider>
    </SessionProvider>
  );
}
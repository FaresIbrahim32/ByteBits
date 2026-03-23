import { createContext, useState, useContext } from "react";
import { createOrder, addItemToOrder, removeItemFromOrder, getOrderTotal } from "../api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [orderId, setOrderId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const startOrder = async () => {
    const id = `order-${Date.now()}`;
    await createOrder(id);
    setOrderId(id);
    setCartItems([]);
    setTotal(0);
    return id;
  };

  const addItem = async (item) => {
    let id = orderId;
    if (!id) id = await startOrder();
    await addItemToOrder(id, item.item_id);
    setCartItems((prev) => [...prev, item]);
    const res = await getOrderTotal(id);
    setTotal(res.data.total);
  };

  const removeItem = async (item, index) => {
    if (!orderId) return;
    try {
      await removeItemFromOrder(orderId, item.item_id);
    } catch {
      // item may not exist on backend, still remove from UI
    }
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    try {
      const res = await getOrderTotal(orderId);
      setTotal(res.data.total);
    } catch {
      setTotal((prev) => Math.max(0, prev - (item.price || 0)));
    }
  };

  const clearCart = () => {
    setOrderId(null);
    setCartItems([]);
    setTotal(0);
  };

  return (
    <CartContext.Provider value={{ orderId, cartItems, total, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

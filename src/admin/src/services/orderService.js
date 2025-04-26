// admin/src/services/orderService.js
import { db } from '../firebase/config';
import { ref, push, set, onValue, update } from 'firebase/database';

export const createOrder = (orderData) => {
  const ordersRef = ref(db, 'orders');
  const newOrderRef = push(ordersRef);
  return set(newOrderRef, {
    ...orderData,
    id: newOrderRef.key,
    createdAt: Date.now(),
    status: 'pending' // initial status
  });
};

export const updateOrderStatus = (orderId, newStatus) => {
  const orderRef = ref(db, `orders/${orderId}`);
  return update(orderRef, { status: newStatus });
};

export const getOrders = (callback) => {
  const ordersRef = ref(db, 'orders');
  return onValue(ordersRef, (snapshot) => {
    const orders = [];
    snapshot.forEach((childSnapshot) => {
      orders.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    // Sort by date (newest first)
    orders.sort((a, b) => b.createdAt - a.createdAt);
    callback(orders);
  });
};
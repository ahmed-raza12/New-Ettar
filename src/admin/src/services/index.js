// admin/src/services/index.js
export * from './productService';
export * from './orderService';

// Add this new function to orderService.js
export const getRecentOrders = (callback, limit = 5) => {
  const ordersRef = ref(db, 'orders');
  return onValue(ordersRef, (snapshot) => {
    const orders = [];
    snapshot.forEach((childSnapshot) => {
      orders.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    // Sort by date (newest first) and limit
    callback(orders.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit));
  });
};
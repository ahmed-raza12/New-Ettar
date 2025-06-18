// admin/src/services/productService.js
import { db } from '../firebase/config';
import { 
  ref, 
  push, 
  set, 
  onValue, 
  update, 
  remove,
  get
} from 'firebase/database';

export const addProduct = (product) => {
  const productsRef = ref(db, 'products');
  const newProductRef = push(productsRef);
  return set(newProductRef, {
    ...product,
    id: newProductRef.key,
    createdAt: Date.now()
  });
};

export const updateProduct = (productId, updates) => {
  const productRef = ref(db, `products/${productId}`);
  return update(productRef, updates);
};

export const deleteProduct = (productId) => {
  const productRef = ref(db, `products/${productId}`);
  return remove(productRef);
};

export const getProducts = (callback) => {
  const productsRef = ref(db, 'products');
  return onValue(productsRef, (snapshot) => {
    const products = [];
    snapshot.forEach((childSnapshot) => {
      products.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    callback(products);
  });
};

export const getProductById = async (productId) => {
  try {
    const productRef = ref(db, `products/${productId}`);
    const snapshot = await get(productRef);
    
    if (snapshot.exists()) {
      return {
        id: snapshot.key,
        ...snapshot.val()
      };
    } else {
      console.log('No product found with ID:', productId);
      return null;
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};
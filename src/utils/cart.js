export const getCart = () => {
    try {
      const cart = localStorage.getItem('fragranceCart');
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading cart:', error);
      return [];
    }
  };
  
  export const saveCart = (cart) => {
    try {
      localStorage.setItem('fragranceCart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };
  
  export const addToCart = (product) => {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    saveCart(cart);
    return cart;
  };
  
  export const removeFromCart = (productId) => {
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
    return cart;
  };
  
  export const updateCartItem = (productId, quantity) => {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
      item.quantity = quantity;
      saveCart(cart);
    }
    
    return cart;
  };
// Cart management functions
export function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

export function addToCart(product, quantity = 1) {
  const cart = getCart();
  // Use both id/_id and name to ensure unique identification
  const existingItem = cart.find(item => 
    (item.product.id === product.id || item.product._id === product._id || 
     item.product.id === product._id || item.product._id === product.id) && 
    item.product.name === product.name
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  return cart;
}

export function removeFromCart(productId) {
  const cart = getCart();
  // Check both id and _id to ensure compatibility
  const updatedCart = cart.filter(item => 
    item.product.id !== productId && 
    item.product._id !== productId
  );
  localStorage.setItem('cart', JSON.stringify(updatedCart));
  return updatedCart;
}

export function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  // Check both id and _id to ensure compatibility
  const item = cart.find(item => 
    item.product.id === productId || 
    item.product._id === productId
  );
  
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    } else {
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }
  
  return cart;
}

export function clearCart() {
  localStorage.removeItem('cart');
  return [];
}

export function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
}

export function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

// Order API functions
export async function createOrder() {
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('userData');
  const cart = getCart();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  if (cart.length === 0) {
    throw new Error('Cart is empty');
  }
  
  let userId = null;
  if (userData) {
    try {
      const parsedUser = JSON.parse(userData);
      userId = parsedUser.id || parsedUser._id;
    } catch (e) {
      throw new Error('User data not found');
    }
  }
  
  if (!userId) {
    throw new Error('User ID not found');
  }
  
  const products = cart.map(item => ({
    productId: item.product._id || item.product.id,
    quantity: item.quantity
  }));
  
  const response = await fetch('https://myapp.local/api/commerce/orders/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    },
    body: JSON.stringify({ 
      userId: userId,
      products: products 
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create order');
  }
  
  const order = await response.json();
  clearCart();
  return order;
}

export async function getUserOrders() {
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('userData');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  let userId = null;
  if (userData) {
    try {
      const parsedUser = JSON.parse(userData);
      userId = parsedUser.id || parsedUser._id;
    } catch (e) {
      // If userData parsing fails, let backend extract from token
    }
  }
  
  const url = userId 
    ? `https://myapp.local/api/commerce/orders/view/${userId}`
    : 'https://myapp.local/api/commerce/orders/view';
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-auth-token': token
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch orders');
  }
  
  return response.json();
}

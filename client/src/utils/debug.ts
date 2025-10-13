// Debug utility to inspect application state
export const debugApplicationState = () => {
  // Check localStorage for cart data
  const cartData = localStorage.getItem('cart-name');
  
  if (cartData) {
    try {
      const parsedCart = JSON.parse(cartData);
      
      if (parsedCart.state && parsedCart.state.cart) {
        parsedCart.state.cart.forEach((item: any, index: number) => {
          // Process cart items silently
        });
      }
    } catch (e) {
      // Handle error silently
    }
  }
  
  // Check localStorage for restaurant data
  const restaurantData = localStorage.getItem('restaurant-name');
  
  if (restaurantData) {
    try {
      const parsedRestaurant = JSON.parse(restaurantData);
    } catch (e) {
      // Handle error silently
    }
  }
  
  // Check user data
  const userData = localStorage.getItem('user-name');
  
  return {
    cartData,
    restaurantData,
    userData
  };
};

// Function to clear all app data (for debugging)
export const clearAllAppData = () => {
  localStorage.removeItem('cart-name');
  localStorage.removeItem('restaurant-name');
  localStorage.removeItem('user-name');
};

// Fix cart items that don't have restaurant info
export const fixCartRestaurantInfo = () => {
  const cartData = localStorage.getItem('cart-name');
  if (!cartData) {
    return;
  }
  
  try {
    const parsedCart = JSON.parse(cartData);
    if (parsedCart.state && parsedCart.state.cart && parsedCart.state.cart.length > 0) {
      // Get current URL to try to extract restaurant ID
      const currentUrl = window.location.pathname;
      let restaurantId = '';
      
      // Try to get restaurant ID from URL or prompt user
      if (currentUrl.includes('/restaurant/')) {
        restaurantId = currentUrl.split('/restaurant/')[1];
      } else {
        restaurantId = prompt('Enter Restaurant ID to fix cart items:') || '';
      }
      
      if (restaurantId) {
        // Update all cart items with restaurant info
        parsedCart.state.cart = parsedCart.state.cart.map((item: any) => ({
          ...item,
          restaurantId: restaurantId,
          restaurantName: item.restaurantName || 'Fixed Restaurant'
        }));
        
        localStorage.setItem('cart-name', JSON.stringify(parsedCart));
      }
    }
  } catch (error) {
    // Handle error silently
  }
};

// Make functions available globally for console debugging
declare global {
  interface Window {
    debugAppState: () => void;
    clearAppData: () => void;
    fixCart: () => void;
  }
}

if (typeof window !== 'undefined') {
  window.debugAppState = debugApplicationState;
  window.clearAppData = clearAllAppData;
  window.fixCart = fixCartRestaurantInfo;
}

// Debug utility to inspect application state
export const debugApplicationState = () => {
  console.log('=== APPLICATION STATE DEBUG ===');
  
  // Check localStorage for cart data
  const cartData = localStorage.getItem('cart-name');
  console.log('Cart localStorage data:', cartData);
  
  if (cartData) {
    try {
      const parsedCart = JSON.parse(cartData);
      console.log('Parsed cart data:', parsedCart);
      
      if (parsedCart.state && parsedCart.state.cart) {
        console.log('Cart items:', parsedCart.state.cart.length);
        parsedCart.state.cart.forEach((item: any, index: number) => {
          console.log(`Cart item ${index}:`, {
            name: item.name,
            restaurantId: item.restaurantId,
            restaurantName: item.restaurantName,
            hasRestaurantInfo: !!(item.restaurantId && item.restaurantName)
          });
        });
      }
    } catch (e) {
      console.log('Error parsing cart data:', e);
    }
  }
  
  // Check localStorage for restaurant data
  const restaurantData = localStorage.getItem('restaurant-name');
  console.log('Restaurant localStorage data:', restaurantData);
  
  if (restaurantData) {
    try {
      const parsedRestaurant = JSON.parse(restaurantData);
      console.log('Parsed restaurant data:', parsedRestaurant);
    } catch (e) {
      console.log('Error parsing restaurant data:', e);
    }
  }
  
  // Check user data
  const userData = localStorage.getItem('user-name');
  console.log('User localStorage data:', userData ? 'Present' : 'Not found');
  
  return {
    cartData,
    restaurantData,
    userData
  };
};

// Function to clear all app data (for debugging)
export const clearAllAppData = () => {
  console.log('Clearing all application data...');
  localStorage.removeItem('cart-name');
  localStorage.removeItem('restaurant-name');
  localStorage.removeItem('user-name');
  console.log('All data cleared. Please refresh the page.');
};

// Fix cart items that don't have restaurant info
export const fixCartRestaurantInfo = () => {
  const cartData = localStorage.getItem('cart-name');
  if (!cartData) {
    console.log('No cart data found');
    return;
  }
  
  try {
    const parsedCart = JSON.parse(cartData);
    if (parsedCart.state && parsedCart.state.cart && parsedCart.state.cart.length > 0) {
      console.log('Found cart items:', parsedCart.state.cart.length);
      
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
        console.log('Cart items fixed with restaurant ID:', restaurantId);
        console.log('Please refresh the page');
      }
    }
  } catch (error) {
    console.error('Error fixing cart:', error);
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

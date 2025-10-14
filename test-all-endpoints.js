// Comprehensive test of all API endpoints
const axios = require('axios');

const BASE_URL = 'https://food-app-ikzt.onrender.com/api/v1';
const FRONTEND_URL = 'https://food-app-83e41.web.app';

// Configure axios
axios.defaults.withCredentials = true;

const headers = {
  'Content-Type': 'application/json',
  'Origin': FRONTEND_URL
};

async function testAllEndpoints() {
  console.log('🚀 Testing all API endpoints...\n');

  // Test 1: Database connection
  try {
    console.log('1. Testing database connection...');
    const dbTest = await axios.get('https://food-app-ikzt.onrender.com/db-test');
    console.log('✅ Database:', dbTest.data.message);
  } catch (error) {
    console.log('❌ Database test failed:', error.message);
  }

  // Test 2: Get all restaurants
  try {
    console.log('\n2. Testing restaurants endpoint...');
    const restaurants = await axios.get(`${BASE_URL}/restaurant/all`, { headers });
    console.log('✅ Restaurants:', `Found ${restaurants.data.restaurants?.length || 0} restaurants`);
  } catch (error) {
    console.log('❌ Restaurants test failed:', error.message);
  }

  // Test 3: Order API test
  try {
    console.log('\n3. Testing orders endpoint...');
    const orderTest = await axios.get(`${BASE_URL}/orders/test`, { headers });
    console.log('✅ Orders API:', orderTest.data.message);
  } catch (error) {
    console.log('❌ Orders test failed:', error.message);
  }

  // Test 4: Test signup (this will create a test user)
  try {
    console.log('\n4. Testing signup endpoint...');
    const testUser = {
      fullName: 'API Test User',
      email: `test${Date.now()}@example.com`,
      password: 'testpass123',
      contact: '1234567890'
    };
    const signup = await axios.post(`${BASE_URL}/users/signup`, testUser, { headers });
    console.log('✅ Signup:', signup.data.message);
    
    if (signup.data.otpForDevelopment) {
      console.log('🔐 Generated OTP:', signup.data.otpForDevelopment);
    }
  } catch (error) {
    console.log('❌ Signup test failed:', error.response?.data?.message || error.message);
  }

  console.log('\n🎉 API endpoint testing completed!');
  console.log('\nNext steps:');
  console.log('1. Visit https://food-app-83e41.web.app');
  console.log('2. Try signing up with a new email');
  console.log('3. Check your browser console for any errors');
  console.log('4. Check if restaurants are loading on the homepage');
}

testAllEndpoints().catch(console.error);
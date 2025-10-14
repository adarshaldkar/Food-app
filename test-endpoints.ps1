# PowerShell script to test all API endpoints
$BASE_URL = "https://food-app-ikzt.onrender.com/api/v1"
$FRONTEND_URL = "https://food-app-83e41.web.app"

$headers = @{
    "Content-Type" = "application/json"
    "Origin" = $FRONTEND_URL
}

Write-Host "🚀 Testing all API endpoints..." -ForegroundColor Green

# Test 1: Database connection
Write-Host "`n1. Testing database connection..." -ForegroundColor Yellow
try {
    $dbTest = Invoke-WebRequest -Uri "https://food-app-ikzt.onrender.com/db-test" -UseBasicParsing
    $dbData = $dbTest.Content | ConvertFrom-Json
    Write-Host "✅ Database: $($dbData.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Database test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get all restaurants
Write-Host "`n2. Testing restaurants endpoint..." -ForegroundColor Yellow
try {
    $restaurants = Invoke-WebRequest -Uri "$BASE_URL/restaurant/all" -Headers $headers -UseBasicParsing
    $restaurantData = $restaurants.Content | ConvertFrom-Json
    $count = if ($restaurantData.restaurants) { $restaurantData.restaurants.Length } else { 0 }
    Write-Host "✅ Restaurants: Found $count restaurants" -ForegroundColor Green
} catch {
    Write-Host "❌ Restaurants test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Order API test
Write-Host "`n3. Testing orders endpoint..." -ForegroundColor Yellow
try {
    $orderTest = Invoke-WebRequest -Uri "$BASE_URL/orders/test" -Headers $headers -UseBasicParsing
    $orderData = $orderTest.Content | ConvertFrom-Json
    Write-Host "✅ Orders API: $($orderData.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Orders test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Test signup
Write-Host "`n4. Testing signup endpoint..." -ForegroundColor Yellow
try {
    $timestamp = [DateTimeOffset]::Now.ToUnixTimeMilliseconds()
    $testUser = @{
        fullName = "API Test User"
        email = "test$timestamp@example.com"
        password = "testpass123"
        contact = "1234567890"
    } | ConvertTo-Json

    $signup = Invoke-WebRequest -Uri "$BASE_URL/users/signup" -Method POST -Headers $headers -Body $testUser -UseBasicParsing
    $signupData = $signup.Content | ConvertFrom-Json
    Write-Host "✅ Signup: $($signupData.message)" -ForegroundColor Green
    
    if ($signupData.otpForDevelopment) {
        Write-Host "🔐 Generated OTP: $($signupData.otpForDevelopment)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Signup test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 API endpoint testing completed!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Visit https://food-app-83e41.web.app"
Write-Host "2. Try signing up with a new email"
Write-Host "3. Check your browser console for any errors"
Write-Host "4. Check if restaurants are loading on the homepage"
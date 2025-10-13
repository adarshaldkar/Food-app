# 🍕 Food Delivery App

A modern, full-featured food delivery application built with React, TypeScript, and Tailwind CSS. This app connects customers with restaurants, providing a seamless ordering experience for food lovers and powerful management tools for restaurant owners.

## 🌟 Key Features

### 👤 **User Features**
- **User Registration & Authentication** - Sign up, login, email verification, password reset
- **Browse Restaurants** - View all available restaurants in your area
- **Search & Filter** - Find restaurants by name, cuisine type, or location  
- **Restaurant Details** - View restaurant info, menu items, ratings, and delivery time
- **Shopping Cart** - Add items to cart, modify quantities, view total cost
- **Secure Checkout** - Multiple payment options including Stripe and Google Pay
- **Order Tracking** - Real-time order status updates from preparation to delivery
- **Order History** - View all past orders with detailed information
- **Profile Management** - Update personal information, delivery address, and preferences
- **Dark/Light Theme** - Toggle between dark and light modes

### 🏪 **Restaurant Owner Features**  
- **Owner Registration** - Apply to become a restaurant owner with email verification
- **Restaurant Management** - Create and update restaurant profile, location, cuisines
- **Menu Management** - Add, edit, and remove menu items with images and descriptions
- **Order Management** - View incoming orders, update order status (confirmed, preparing, out for delivery, delivered)
- **Business Dashboard** - Track restaurant performance and order analytics

### 🛡️ **Admin Features**
- **Owner Request Management** - Approve or reject restaurant owner applications
- **System Monitoring** - Oversee platform operations and user activities
- **Admin Dashboard** - Access administrative tools and system controls

## 🚀 **Tech Stack**

### **Frontend**
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development and better code quality
- **Vite** - Fast build tool and development server
- **React Router v7** - Client-side routing with protected routes
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Radix UI** - Accessible, unstyled UI components
- **Lucide React** - Beautiful icon library

### **Payment Integration**
- **Stripe** - Secure payment processing
- **Google Pay** - Quick checkout option

### **Form Validation & API**
- **Zod** - Schema validation for forms and API responses  
- **Axios** - HTTP client for API calls
- **React Hook Form** - Efficient form handling

### **UI/UX Features**
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Loading Skeletons** - Smooth loading states for better user experience
- **Toast Notifications** - User-friendly success and error messages
- **Dark/Light Theme** - Automatic theme switching support

## 📱 **App Screenshots & Features**

### **Home Page**
- Hero section with featured restaurants
- Search functionality
- Restaurant cards with ratings and cuisine types
- Filter options by cuisine and location

### **Restaurant Detail Page**  
- Restaurant banner image and info
- Complete menu with item images, descriptions, and prices
- Add to cart functionality
- Restaurant ratings and reviews

### **Shopping Cart**
- Item management (add, remove, update quantities)
- Price calculations with taxes and delivery fees
- Secure checkout process
- Address and contact information

### **Order Tracking**
- Real-time order status updates
- Estimated delivery time
- Order details and receipt
- Contact restaurant option

### **User Profile**
- Personal information management
- Order history and favorites
- Address book for multiple delivery locations
- Account settings and preferences

## 🛠️ **Installation & Setup**

### **Prerequisites**
- Node.js (version 16 or higher)
- npm or yarn package manager
- Git

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/adarshaldkar/Food-app
cd Food-app/client
```

### **Step 2: Install Dependencies**
```bash
npm install
# or
yarn install
```

### **Step 3: Environment Setup**
Create a `.env` file in the root directory and add your environment variables:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### **Step 4: Start Development Server**
```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173`

### **Step 5: Build for Production**
```bash
npm run build
# or  
yarn build
```

## 📚 **Project Structure**

<<<<<<< HEAD
```
src/
├── admin/              # Admin and restaurant owner components
│   ├── AddMenu.tsx     # Menu item management
│   ├── EditMenu.tsx    # Edit menu items
│   ├── Orders.tsx      # Restaurant order management
│   ├── OwnerRequests.tsx # Admin owner request management
│   └── Resturant.tsx   # Restaurant profile management
├── auth/               # Authentication components
│   ├── login.tsx       # User login
│   ├── SignUp.tsx      # User registration
│   ├── VerifyEmail.tsx # Email verification
│   ├── ForgotPassword.tsx
│   └── ResetPassword.tsx
├── components/         # Main app components
│   ├── HeroSection.tsx # Home page hero
│   ├── SearchPage.tsx  # Restaurant search
│   ├── Cart.tsx        # Shopping cart
│   ├── EnhancedCheckout.tsx # Payment processing
│   ├── OrderStatus.tsx # Order tracking
│   ├── Profile.tsx     # User profile
│   ├── admin/          # Admin-specific components
│   ├── ui/             # Reusable UI components
│   └── skeletons/      # Loading skeleton components
├── hooks/              # Custom React hooks
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── layout/             # App layout components
```
=======

>>>>>>> 2395d5e26152a52bb311ac566fb9a5bbb9eb4954

## 🔐 **User Roles & Permissions**

### **Regular User**
- Browse restaurants and menus
- Place orders and make payments
- Track order status
- Manage profile and addresses
- View order history

### **Restaurant Owner**
- Manage restaurant profile
- Create and edit menu items
- Process incoming orders
- Update order status
- View business analytics

### **Admin**  
- Approve restaurant owner requests
- Monitor platform activities
- Access system-wide controls
- Manage user accounts

## 🎯 **Key User Flows**

### **Customer Order Flow**
1. **Browse** → Search restaurants by location or cuisine
2. **Select** → Choose restaurant and browse menu
3. **Add to Cart** → Select items and quantities
4. **Checkout** → Enter delivery details and payment info
5. **Track** → Monitor order status in real-time
6. **Receive** → Get your delicious food delivered!

### **Restaurant Owner Flow**
1. **Apply** → Submit restaurant owner application
2. **Verify** → Complete email verification process  
3. **Setup** → Create restaurant profile and menu
4. **Manage** → Process orders and update status
5. **Grow** → Track performance and expand business

## 🔒 **Security Features**

- **Protected Routes** - Authentication required for sensitive pages
- **Role-Based Access** - Different permissions for users, owners, and admins
- **Email Verification** - Mandatory email verification for new accounts
- **Secure Payments** - PCI-compliant payment processing with Stripe
- **Input Validation** - Client and server-side validation for all forms
- **HTTPS Ready** - SSL/TLS encryption for production deployment

## 📱 **Mobile Responsiveness**

The app is fully responsive and provides excellent user experience across all devices:
- **Mobile** (320px - 768px) - Touch-optimized interface
- **Tablet** (768px - 1024px) - Adaptive layout
- **Desktop** (1024px+) - Full-featured experience

## 🎨 **UI/UX Features**

- **Modern Design** - Clean, intuitive interface following Material Design principles
- **Smooth Animations** - CSS transitions and hover effects for better interaction
- **Loading States** - Skeleton screens and loading spinners for better perceived performance  
- **Error Handling** - User-friendly error messages and recovery options
- **Accessibility** - WCAG 2.1 compliant with keyboard navigation support

## 🧪 **Testing & Development**

### **Available Scripts**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint for code quality
```

### **Code Quality Tools**
- **ESLint** - Code linting and formatting
- **TypeScript** - Static type checking
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit validation

## 🚀 **Deployment**

The app is ready for deployment on various platforms:

### **Vercel** (Recommended)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### **Netlify**
```bash
npm run build  
# Deploy dist/ folder to Netlify
```

### **Manual Deployment**
```bash
npm run build
# Upload dist/ folder contents to your web server
```

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 **Support**

Need help? Here's how to get support:

- 📧 **Email**: support@fooddeliveryapp.com
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/adarshaldkar/Food-app/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/adarshaldkar/food-app/discussions)
https://github.com/adarshaldkar/Food-app
## 🎯 **Future Enhancements**

- **Real-time Chat** - Customer-restaurant communication
- **Push Notifications** - Order updates and promotions
- **Loyalty Program** - Rewards and points system
- **Reviews & Ratings** - Customer feedback system
- **Multiple Payment Methods** - PayPal, Apple Pay, cryptocurrency
- **Delivery Tracking** - GPS-based live tracking
- **Social Features** - Share orders and reviews
- **Advanced Analytics** - Business intelligence dashboard

---

**Made with ❤️ by [Your Name]**

*Bringing delicious food to your doorstep, one order at a time!*

---

## 🏃‍♂️ **Quick Start Guide**

1. **Clone** → `git clone [repository-url]`
2. **Install** → `npm install` 
3. **Setup** → Create `.env` file with API URL
4. **Run** → `npm run dev`
5. **Visit** → `http://localhost:5173`
6. **Enjoy** → Start exploring the app! 🎉

*That's it! You're ready to start using the Food Delivery App.*

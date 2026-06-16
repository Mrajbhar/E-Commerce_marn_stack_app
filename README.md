# 🛍️ MarketHub — MERN E-Commerce Platform

A full-stack e-commerce application built with the **MERN** stack (MongoDB, Express, React, Node.js). Features a complete storefront, admin dashboard, secure authentication (including Google sign-in), Braintree payments, and a fully responsive editorial-style design with light/dark mode.

---

## ✨ Features

### 🛒 Storefront
- **Dynamic homepage** with admin-managed hero banners, category showcase, new arrivals, best sellers, and special offers
- **Product catalog** with filtering by category and price, pagination, and "load more"
- **Rich product pages** — multi-image gallery, discount badges, stock status, brand, SKU, specifications, tags, and ratings
- **Search** across product name, description, brand, SKU, and tags
- **Shopping cart** with quantity controls, discount savings display, free-shipping progress, and sold-out handling
- **Category browsing** with dynamic images and live product counts
- **Light / dark mode** toggle across the entire app

### 🔐 Authentication
- Email + password registration and login (JWT-based)
- **Google Sign-In** (OAuth via `@react-oauth/google`)
- Forgot-password flow with security question
- Role-based access control (customer / admin)
- Persistent sessions via localStorage

### 👤 Customer Dashboard
- Profile management
- Order history with order details

### 🛠️ Admin Dashboard
- **Product management** — create, edit, delete with multi-photo upload (up to 5 images), pricing, discounts, stock status, specs, and tags
- **Category management** — create/edit with image upload and "featured" flag
- **Banner management** — upload, reorder (drag & drop), schedule, and toggle hero banners
- **Order management** — view all orders and update status
- **User management** — view users and change roles

### 💳 Payments
- Braintree payment gateway integration (cards + PayPal)

---

## 🧰 Tech Stack

**Frontend**
- React (Create React App)
- React Router DOM
- Ant Design (modals, selects)
- Axios
- React Hot Toast
- Framer Motion (animations)
- React Slick (carousels)
- React Icons
- AOS (scroll animations)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Token (JWT)
- bcrypt (password hashing)
- express-formidable (file uploads)
- Braintree SDK
- Google Auth (OAuth token verification)

---

## 📦 Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local instance or MongoDB Atlas)
- A **Google Cloud OAuth Client ID** (for Google login)
- A **Braintree sandbox account** (for payments)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/markethub.git
cd markethub
```

### 2. Backend setup
```bash
# from the project root (where server.js lives)
npm install
```

Create a `.env` file in the backend root:
```env
PORT=8080
DEV_MODE=development
MONGO_URL=your_mongodb_connection_string
JWT_SECRRET=your_jwt_secret
BRAINTREEE_MERCHANT_ID=your_braintree_merchant_id
BRAINTREEE_PUBLIC_KEY=your_braintree_public_key
BRAINTREEE_PRIVATE_KEY=your_braintree_private_key
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

Start the backend:
```bash
npm start
```
The API runs at `http://localhost:8080`.

### 3. Frontend setup
```bash
cd client
npm install
```

Create a `.env` file in the `client` folder:
```env
REACT_APP_API=http://localhost:8080
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```
> ⚠️ No spaces around `=`. Restart the dev server after editing `.env`.

Start the frontend:
```bash
npm start
```
The app runs at `http://localhost:3000`.

---

## 🔑 Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → **APIs & Services → Credentials**
3. Create an **OAuth 2.0 Client ID** (Web application)
4. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000` (development)
   - `https://your-domain.com` (production)
5. Copy the **Client ID** into both `.env` files (client and server)

---

## 📁 Project Structure

```
markethub/
├── client/                     # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Auth/           # GoogleAuthButton
│       │   ├── Layout/         # Header, Footer, Layout, menus
│       │   ├── Product/        # Shared ProductCard
│       │   └── Routes/         # Private & Admin route guards
│       ├── context/            # auth, cart, search contexts
│       ├── hooks/              # useCategory, etc.
│       ├── pages/
│       │   ├── Admin/          # Dashboard, products, categories, banners, orders, users
│       │   ├── Auth/           # Login, Register, ForgotPassword
│       │   ├── user/           # Dashboard, Orders, Profile
│       │   └── Themes/         # ThemeContext, toggle
│       └── styles/             # CSS files
│
├── config/                     # db connection
├── controller/                 # route controllers
├── middlewares/                # auth middleware
├── models/                     # Mongoose schemas
├── routes/                     # Express routes
└── server.js                   # entry point
```

---

## 🌐 API Endpoints (overview)

### Auth — `/api/v1/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Email/password login |
| POST | `/google-login` | Google OAuth login |
| POST | `/forgot-password` | Reset password |
| PUT | `/profile` | Update profile |
| GET | `/orders` | User's orders |
| GET | `/all-orders` | All orders (admin) |
| GET | `/all-users` | All users (admin) |

### Products — `/api/v1/product`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-product` | Create product (admin) |
| GET | `/get-product` | All products |
| GET | `/get-product/:slug` | Single product |
| GET | `/product-photo/:pid` | Main photo |
| GET | `/product-photo/:pid/:index` | Gallery photo |
| PUT | `/update-product/:pid` | Update (admin) |
| DELETE | `/delete-product/:pid` | Delete (admin) |
| GET | `/search/:keyword` | Search products |

### Categories — `/api/v1/category`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-category` | Create (admin) |
| GET | `/get-category` | All categories |
| GET | `/category-photo/:id` | Category image |
| GET | `/category-counts` | Product counts per category |

### Banners — `/api/v1/banner`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/active` | Active banners (public) |
| GET | `/all` | All banners (admin) |
| POST | `/create` | Create (admin) |
| PUT | `/update/:id` | Update (admin) |
| PUT | `/reorder` | Reorder (admin) |
| DELETE | `/delete/:id` | Delete (admin) |

---

## 👮 Creating an Admin User

New users default to the **customer** role (`role: 0`). To make a user an admin:
1. Register normally, then
2. Either change `role` to `1` directly in MongoDB, **or**
3. Log in as an existing admin and promote them from the **Users** page in the admin dashboard.

---

## 📜 Available Scripts

**Backend**
```bash
npm start        # start the server
```

**Frontend** (in `/client`)
```bash
npm start        # development server
npm run build    # production build
```

---

## 🤝 Contributing

Contributions are welcome! Please fork the repo, create a feature branch, and open a pull request.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

Built as a full-stack MERN learning project, featuring a custom editorial-luxe design system with Fraunces + Hanken Grotesk typography.
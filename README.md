# Food Zone 🍕

Food Zone is a full-stack, production-level online food ordering web application crafted specifically as a final year diploma IT project. Built with modern web development paradigms, it features a trendy Gen Z-oriented UI, snappy page transitions, robust state management, and an encapsulated backend architecture.

## 🚀 Tech Stack

### Frontend
- **Framework:** React.js initialized via Vite
- **Styling:** Tailwind CSS v4 for utility-first responsive styling
- **Animations:** Framer Motion for smooth micro-interactions and transitions
- **State Management:** Zustand for lightweight, scalable Cart state
- **Routing:** React Router v7
- **Database/Auth UI Tools:** Firebase Web SDK

### Backend
- **Environment:** Node.js
- **Framework:** Express.js for REST integration
- **Database Access:** Firebase Admin SDK (Firestore integration)
- **Authentication:** Firebase Auth token verifications middleware

---

## 🌟 Key Features
- **Bright, Modern UI:** Glassmorphism, trendy gradients, and fully responsive layouts.
- **Real-time Search & Filtering:** Quick menu and restaurant finders specifically tailored to 100% pure vegetarian menus.
- **0ms Data Caching:** Implementing custom Zustand pre-fetching to serve multi-page data globally without loading screens!
- **Sophisticated Cart System:** Client-side dynamic calculation with Zustand.
- **Role-based Authentication:** Separate user experiences and protected routes (`/admin`, `/profile`) using Firebase.
- **Admin Dashboard:** Central hub for managing restaurants, food availability, and orders.
- **Smooth UX:** Hover details, toast notifications (`react-toastify`), and intelligent empty-states.

---

## 🛠️ Step-by-Step Setup Instructions

### 1. Firebase Configuration
To execute this project properly, you need Firebase integrated.
1. Head to the [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Enable **Firestore Database** and **Authentication** (Email/Password).
3. **Frontend:** Go to Project Settings > General > Your Apps, and copy the `firebaseConfig` object. Paste it directly into `frontend/src/firebase/config.js`.
4. **Backend:** Go to Project Settings > Service Accounts and generate a new private key. Download `serviceAccountKey.json` and place it in the `backend/config/` directory.

### 2. Booting the Backend Server
```bash
cd backend
npm install
npm run dev
```
*The Express server will start running locally on `http://localhost:5000`.*

### 3. Booting the Frontend Development Server
Open a new terminal session.
```bash
cd frontend
npm install
npm run dev
```
*Vite will compile your React files and serve it usually on `http://localhost:5173`. Click the link to view the app!*

---

## 🎯 Final Submission Guide 
When presenting this in your viva, be sure to highlight:
1. **Component Reusability:** Emphasize how `FoodItemCard` and `RestaurantCard` are fed by centralized data sources.
2. **State Management:** Explain that Zustand is utilized over Redux to remove boilerplate while still offering pure state synchronization (useful for the Cart Badge in the Navbar).
3. **Security Constraints:** Explain how the React Router protected routes actively watch Firebase Auth state to block unauthenticated access. 

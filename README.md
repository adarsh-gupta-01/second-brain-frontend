# 🧠 Second Brain - Frontend

> A modern personal knowledge management and content curation platform built with cutting-edge React technologies.

**Live Demo:** [View Application](https://thought-pool.vercel.app)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646cff?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## 🎯 Overview

**Second Brain** is a sophisticated content management system that transforms how users collect, organize, and share digital content. The application provides a unified platform to manage diverse content types—from social media posts to documents—with an intuitive, responsive interface designed for modern web standards.

This repository contains the **frontend** implementation, built with React 19 and modern development practices, demonstrating professional software architecture and state management patterns.

---

## ✨ Key Features

### 📋 **Content Management**
- **Multi-Format Support** - Seamlessly manage tweets, YouTube videos, Instagram posts, images, documents, and notes
- **CRUD Operations** - Full Create, Read, Update, Delete functionality for all content types
- **Smart Organization** - Automatic categorization with custom tagging system
- **Rich Preview** - Embedded displays for social media content with automatic embed loading

### 🏷️ **Organization & Navigation**
- **Smart Filtering** - Category-based filtering via sidebar navigation
- **Content Statistics** - Real-time count tracking for each content type
- **Category Routes** - Dedicated routes for each content type (`/twitter`, `/youtube`, `/images`, etc.)
- **Search & Browse** - Intuitive interface for discovering saved content

### 👥 **Social & Sharing**
- **Public Sharing** - Generate and share unique shareable links to your entire content collection
- **Shared Brain Viewing** - Explore other users' shared collections without authentication
- **User Profiles** - Personalized profiles with customizable avatar and bio

### 🎨 **User Experience**
- **Dark Mode** - Seamless light/dark theme switching with persistent preferences
- **Responsive Design** - Mobile-first approach with full responsiveness across devices
- **Toast Notifications** - Real-time user feedback for all actions
- **Loading States** - Professional loading indicators with animated spinners
- **Smooth Animations** - Framer Motion powered transitions and micro-interactions

### 🔐 **Authentication & Security**
- **Secure Auth** - User registration and login with session management
- **Protected Routes** - Role-based access control for authenticated users
- **Session Persistence** - Automatic session restoration with refresh token logic
- **CORS Security** - Proper cross-origin resource sharing configuration

---

## 🛠️ Tech Stack

### Frontend Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI framework with concurrent rendering features |
| **TypeScript** | 5.9 | Type-safe development with strict checking |
| **Vite** | 7.1.7 | Lightning-fast build tool with HMR |

### State Management & Routing
| Technology | Version | Purpose |
|------------|---------|---------|
| **React Router DOM** | 7.9.4 | Client-side routing with modern API |
| **React Context API** | Built-in | Global state (Auth, Modals, Theme) |
| **TanStack React Query** | 5.90.2 | Server state management and caching |

### Styling & UI Components
| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 4.1.14 | Utility-first CSS framework |
| **Lucide React** | 0.545 | Modern, consistent icon library |
| **Framer Motion** | 12.23.24 | Professional animations and transitions |

### API & Network
| Technology | Version | Purpose |
|------------|---------|---------|
| **Axios** | 1.12.2 | Promise-based HTTP client with interceptors |
| **React Hot Toast** | 2.6.0 | Non-blocking toast notifications |
| **React Spinners** | 0.17.0 | Loading animations |

### Developer Experience
| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | 9.36.0 | Code quality and best practices |
| **TypeScript ESLint** | 8.45.0 | Type-aware linting |
| **React Hooks Plugin** | 5.2.0 | Hooks best practices validation |

---

## 📁 Project Structure

```
src/
├── pages/                          # Page components & routes
│   ├── Home.tsx                   # Main dashboard with content grid
│   ├── DetailedCardView.tsx       # Individual content detail page
│   ├── SharedBrain.tsx            # Public shared content view
│   ├── ProfilePage.tsx            # User profile management
│   ├── SignIn.tsx                 # Login page
│   ├── SignUp.tsx                 # Registration page
│   └── Logout.tsx                 # Logout handler
│
├── components/                     # Reusable UI components
│   ├── Card.tsx                   # Content card with actions
│   ├── Button.tsx                 # Custom button component
│   ├── Input.tsx                  # Form input component
│   ├── AddContentModal.tsx        # Modal for content creation
│   ├── EditContentModal.tsx       # Modal for content editing
│   ├── DeleteConfirmationModal.tsx# Delete confirmation UI
│   ├── ShareModal.tsx             # Shareable link generator
│   ├── ProfileModal.tsx           # User profile management
│   ├── LogoutModal.tsx            # Logout confirmation
│   ├── ProtectedRoute.tsx         # Authentication wrapper
│   ├── Embed.tsx                  # Content embedding handler
│   ├── DarkModeToggle.tsx         # Theme switcher
│   └── SidebarItem.tsx            # Navigation sidebar item
│
├── context/                        # React Context providers
│   ├── AuthContext.tsx            # Auth state & user data
│   ├── ModalContext.tsx           # Modal visibility management
│   ├── ThemeContext.tsx           # Dark mode state
│   ├── useModal.ts                # Custom hook for modals
│   └── useTheme.ts                # Custom hook for theme
│
├── icons/                          # SVG icon components
│   ├── TwitterIcon.tsx, YouTubeIcon.tsx, InstagramIcon.tsx
│   ├── DocumentsIcon.tsx, NotesIcon.tsx, ImageIcon.tsx
│   └── [20+ custom SVG icons]
│
├── api/
│   └── client.ts                  # Axios configuration & API endpoints
│
├── theme/
│   ├── index.ts                   # Theme configuration
│   └── utils.ts                   # Theme utilities
│
├── App.tsx                         # Root application component
├── Routes.tsx                      # Route configuration
├── main.tsx                        # Application entry point
├── App.css                         # Global styles
└── index.css                       # Base CSS
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Backend API** running (configure via `.env.local`)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/adarsh-gupta-01/second-brain-frontend.git
   cd second-brain-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your API configuration:
   ```env
   VITE_API_KEY=http://localhost:3000/api
   VITE_PRODUCTION_URL=https://your-domain.com
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview

# Run ESLint code quality checks
npm run lint
```

---

## 💡 Usage & Features

### Adding Content
1. Click the **"+" button** in the header
2. Select content type (Tweet, YouTube, Image, etc.)
3. Fill in details: title, link, tags, and optional notes
4. Upload file if applicable
5. Click **Save** - embedded content automatically loads

### Organizing Content
- Use **sidebar categories** to filter by type
- View **count statistics** for each category
- Access **dedicated routes** for each content type
- **Search and browse** through your collection

### Sharing Your Brain
1. Click the **Share button** in the header
2. Toggle sharing status and copy the link
3. Share the unique URL with others
4. Viewers can explore your content without login

### Profile Management
- Click **profile icon** in header
- Update **avatar, bio, and username**
- Manage **account settings**

### Theme Customization
- Click **theme toggle** icon
- Switch between **light and dark modes**
- Preference automatically saved to browser

---

## 🏗️ Architecture & Design Patterns

### Component Architecture
- **Container/Presentational Pattern** - Smart components handle logic, presentational components handle UI
- **Custom Hooks** - `useModal()`, `useTheme()` for state encapsulation and reusability
- **Compound Components** - Modal and form components designed to work together
- **Prop Composition** - Clean prop interfaces with TypeScript validation

### State Management Strategy
```
┌─────────────────────────────────────────┐
│      React Application State            │
├─────────────────────────────────────────┤
│ Context API         React Query         │
│ ├─ Auth Context    ├─ Content queries  │
│ ├─ Modal Context   ├─ User queries     │
│ └─ Theme Context   └─ Caching          │
└─────────────────────────────────────────┘
```

### HTTP Client Pattern
- **Centralized Axios Instance** - Single configuration point for all requests
- **Request Interceptors** - Automatic auth token injection
- **Response Interceptors** - Error handling and user feedback
- **API Endpoints** - Organized method exports for type safety

### Error Handling
- **Client-side Validation** - Form validation before submission
- **Server Error Handling** - Graceful error recovery
- **User Feedback** - Toast notifications for all operations
- **Session Management** - Automatic logout on auth failures

---

## 🔒 Security Features

✅ **Protected Routes** - Authentication required for sensitive pages  
✅ **CORS Configuration** - Proper cross-origin resource sharing  
✅ **Session Management** - Secure cookie-based sessions  
✅ **Input Validation** - Client-side validation before submission  
✅ **XSS Prevention** - React's built-in XSS protection  
✅ **Credential Handling** - Secure credential transmission with `withCredentials`  

---

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```

Creates an optimized build in the `dist/` folder.

### Deployment Platforms

**Vercel** (Recommended)
- Optimized for Vite/React projects
- Zero-config deployment
- See `vercel.json` for configuration

**Netlify**
- CI/CD integration with git
- See `netlify.toml` for configuration

**Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

**Cloud Hosting** - AWS S3 + CloudFront, Google Cloud Storage, Azure Static Web Apps

---

## 🔄 API Integration

### Base Configuration
- **Base URL** - Configurable via `VITE_API_KEY` environment variable
- **Timeout** - 10 seconds default
- **Credentials** - Included in all requests for session management
- **Headers** - Automatic Content-Type and Authorization headers

### Key API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/login` | User login |
| POST | `/signup` | User registration |
| POST | `/logout` | User logout |
| GET | `/me` | Get current user info |
| PUT | `/me` | Update user profile |
| POST | `/content` | Create content |
| GET | `/content` | Fetch all/filtered content |
| GET | `/content/stats` | Get category counts |
| PUT | `/content` | Update content |
| DELETE | `/content` | Delete content |
| POST | `/brain/share` | Toggle brain sharing |
| GET | `/brain/:shareId` | View shared brain |

---

## 📊 Performance Optimizations

- **Code Splitting** - Lazy-loaded route components
- **Tree Shaking** - Unused code eliminated in production
- **CSS Purging** - Only included used Tailwind classes
- **Image Optimization** - Responsive images with proper sizing
- **Memoization** - React.memo and useCallback for prevention of unnecessary renders
- **Bundle Analysis** - Optimized chunk sizes

---

## 🐛 Troubleshooting

### API Connection Issues
- Verify `VITE_API_KEY` environment variable is set correctly
- Ensure backend server is running on configured port
- Check CORS configuration in backend

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript Errors
```bash
# Rebuild TypeScript
npm run build -- --force
```

---

## �‍💻 Author

**Adarsh**  
- GitHub: [@adarsh-gupta-01](https://github.com/adarsh-gupta-01)

Built with modern web technologies and attention to detail.

---

<div align="center">

**[⬆ Back to Top](#-second-brain---frontend)**

Made with ❤️ | [View Backend Repository](https://github.com/adarsh-gupta-01/second-brain-backend)

</div>
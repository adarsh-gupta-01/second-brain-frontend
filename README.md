# 🧠 Second Brain - Frontend

A modern, feature-rich personal knowledge management and content curation platform. Organize, categorize, and share your digital brain across multiple content types with an intuitive, responsive interface.

> **Built with:** React 19 • TypeScript • Vite • Tailwind CSS • React Router v7

---

## 🎯 Overview

**Second Brain** is a full-stack web application that lets users collect, organize, and share content from various sources including tweets, YouTube videos, articles, notes, images, and more. Think of it as your personal content hub where everything you find interesting is stored and easily accessible.

This repository contains the **frontend** built with modern React practices and cutting-edge tooling for optimal performance and developer experience.

---

## ✨ Key Features

### 📋 Content Management
- **Add Content** - Easily save links, notes, documents, images from multiple sources
- **Edit & Delete** - Full CRUD operations on all your saved content
- **Detailed View** - Expanded view for individual content items with preview capabilities
- **Automatic Embeds** - Automatic embedding of tweets, YouTube videos, Instagram posts, and more

### 🏷️ Organization & Filtering
- **Multi-Category Support** - Organize content by type:
  - 🐦 Tweets & Twitter Links
  - 🎬 YouTube Videos
  - 📷 Instagram Posts & Images
  - 📄 Documents & Articles
  - 📝 Notes
  - 🔗 Links
- **Smart Filtering** - Quick sidebar navigation to filter content by category
- **Content Statistics** - View count summaries for each category

### 👥 Social & Sharing
- **Public Sharing** - Share your entire brain with unique shareable links
- **Shared Brain Viewing** - View and explore other users' shared content collections
- **User Profiles** - Personalized profiles with avatar and bio

### 🎨 User Experience
- **Dark Mode Toggle** - Seamless light/dark theme switching
- **Responsive Design** - Fully mobile-responsive interface with responsive sidebar
- **Real-time Notifications** - Toast notifications for user actions
- **Smooth Animations** - Framer Motion powered transitions and interactions
- **Loading States** - Professional loading indicators with spinners

### 🔐 Authentication
- **Secure Sign In/Sign Up** - User registration and login system
- **Protected Routes** - Secured endpoints for authenticated users only
- **Session Management** - Persistent user sessions with automatic refresh
- **Profile Management** - Update user information and preferences

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.1.1** - Latest React with concurrent features
- **TypeScript 5.9** - Type-safe development with strict checking
- **Vite 7.1.7** - Lightning-fast build tool with HMR

### Styling & UI
- **Tailwind CSS 4.1.14** - Utility-first CSS framework
- **Tailwind CSS Vite Plugin** - Optimized integration with Vite
- **Framer Motion 12.23.24** - Professional animations and transitions
- **Lucide React 0.545** - Beautiful, consistent icon library

### State Management & Data
- **React Router DOM 7.9.4** - Client-side routing with modern API
- **React Context API** - Lightweight state management (Auth, Modal, Theme)
- **TanStack React Query 5.90.2** - Server state management and caching
- **Axios 1.12.2** - Promise-based HTTP client for API calls

### Developer Experience
- **ESLint 9.36.0** - Code quality and best practices enforcement
- **TypeScript ESLint** - Type-aware linting rules
- **ESLint React Hooks Plugin** - Hooks rules validation
- **React Hot Toast 2.6.0** - Beautiful toast notifications
- **React Spinners 0.17.0** - Loading spinner animations

---

## 📁 Project Structure

```
src/
├── pages/                      # Page components
│   ├── Home.tsx               # Main dashboard with filtered content
│   ├── DetailedCardView.tsx   # Individual content detail view
│   ├── SharedBrain.tsx        # Public shared content view
│   ├── ProfilePage.tsx        # User profile management
│   ├── SignIn.tsx             # Login page
│   ├── SignUp.tsx             # Registration page
│   └── Logout.tsx             # Logout handler
│
├── components/                # Reusable UI components
│   ├── Card.tsx               # Content card component
│   ├── Button.tsx             # Custom button component
│   ├── Input.tsx              # Form input component
│   ├── AddContentModal.tsx    # Modal for adding new content
│   ├── EditContentModal.tsx   # Modal for editing content
│   ├── DeleteConfirmationModal.tsx
│   ├── ShareModal.tsx         # Share brain functionality
│   ├── ProfileModal.tsx       # User profile modal
│   ├── LogoutModal.tsx        # Logout confirmation
│   ├── ProtectedRoute.tsx     # Auth-protected route wrapper
│   ├── Embed.tsx              # Content embedding handler
│   ├── DarkModeToggle.tsx     # Theme switcher
│   └── SidebarItem.tsx        # Sidebar navigation item
│
├── context/                   # React Context API providers
│   ├── AuthContext.tsx        # Authentication state & logic
│   ├── ModalContext.tsx       # Modal visibility state
│   ├── ThemeContext.tsx       # Dark mode state
│   ├── useModal.ts            # Custom hook for modal management
│   └── useTheme.ts            # Custom hook for theme management
│
├── icons/                     # SVG icon components
│   ├── TwitterIcon.tsx, YouTubeIcon.tsx, InstagramIcon.tsx
│   ├── DocumentsIcon.tsx, NotesIcon.tsx, ImagesIcon.tsx
│   └── ... (20+ custom SVG icons)
│
├── api/
│   └── client.ts              # Axios HTTP client configuration
│
├── theme/
│   ├── index.ts               # Theme configuration
│   └── utils.ts               # Theme utility functions
│
├── App.tsx                    # Root application component
├── Routes.tsx                 # Route configuration
├── main.tsx                   # Application entry point
├── App.css                    # Global styles
└── index.css                  # Base styles
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- Backend API running (see backend repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/second-brain-frontend.git
   cd second-brain-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local`:
   ```env
   VITE_API_KEY=http://localhost:3000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

### Available Scripts

```bash
npm run dev          # Start development server with HMR
npm run build        # Build for production (TypeScript + Vite)
npm run preview      # Preview production build locally
npm run lint         # Run ESLint to check code quality
```

---

## 💡 Usage

### Adding Content
1. Click the **"+" button** or press the "Add Content" button
2. Fill in the content details (title, link, category, tags)
3. Select content type (tweet, video, image, note, etc.)
4. Click **Save** - content automatically embeds if applicable

### Organizing Your Brain
- Use the **left sidebar** to filter content by category
- View **content statistics** for each category
- Search and browse through your organized collection

### Sharing Your Brain
1. Click the **Share button** in the header
2. Copy the generated shareable link
3. Share with others - they can view your content without login

### Profile Management
- Click your **profile icon** in the header
- Update avatar, bio, username
- Manage account settings

### Theme Customization
- Click the **theme toggle** icon to switch between light/dark modes
- Theme preference is automatically saved

---

## 🏗️ Architecture & Design Patterns

### Component Architecture
- **Container/Presentational Pattern** - Smart components manage logic, dumb components handle UI
- **Custom Hooks** - `useModal()`, `useTheme()` for state encapsulation
- **Context API** - Global state management for Auth, Modal, and Theme
- **Compound Components** - Modal and form components work together seamlessly

### State Management Strategy
- **Context API** - Light state (Auth, UI modals, theme)
- **React Query** - Server state (content data, pagination)
- **Local State** - Component-level state for forms and UI toggles

### Styling Approach
- **Tailwind CSS** - Utility-first for consistent, maintainable styling
- **Responsive Design** - Mobile-first approach with Tailwind breakpoints
- **Dark Mode** - CSS variables and theme context switching

---

## 🔒 Security Features

- **Protected Routes** - Authentication required for sensitive pages
- **Secure API Calls** - Credentials included in all requests
- **CORS Handling** - Proper cross-origin configuration
- **Input Validation** - Client-side validation before submission
- **XSS Prevention** - React's built-in XSS protection

---

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```

Creates optimized build in `dist/` folder.

### Deployment Options
- **Vercel** - Optimized for Vite/React projects
- **Netlify** - CI/CD integration with git
- **Docker** - Containerized deployment
- **AWS S3 + CloudFront** - Static hosting

The project includes configuration for:
- `vercel.json` - Vercel deployment configuration
- `netlify.toml` - Netlify deployment configuration

---

## 🔄 Git Workflow

```bash
# Feature development
git checkout -b feature/your-feature-name

# Commit with conventional commits
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "refactor: improve code"

# Push and create Pull Request
git push origin feature/your-feature-name
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Ensure all tests pass before submitting PR
- Update README if adding new features
- Keep components small and focused

---

## 📚 Related Repositories

- **[Second Brain Backend](https://github.com/yourusername/second-brain-backend)** - Node.js/Express backend API
- **[Second Brain Mobile](https://github.com/yourusername/second-brain-mobile)** - React Native mobile app

---

## 🐛 Known Issues & Future Enhancements

### Planned Features
- [ ] Advanced search with full-text search
- [ ] Tag management and tag-based filtering
- [ ] Content export (PDF, JSON)
- [ ] Collaborative sharing with permissions
- [ ] Browser extension for quick content capture
- [ ] PWA support for offline access
- [ ] AI-powered content recommendations

### Known Issues
- None currently reported

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Adarsh**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com
- Portfolio: [your-portfolio.com](https://your-portfolio.com)

Built with ❤️ and lots of ☕

---

## 📞 Support

For support, email support@secondbrain.com or open an issue on GitHub.

---

## 🙌 Acknowledgments

- React community for amazing libraries and tools
- Tailwind CSS for utility-first styling
- Vite team for incredible build tool
- All contributors and users

---

**⭐ If you find this project useful, please consider giving it a star!**

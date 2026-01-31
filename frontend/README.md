# Flight Management System - Frontend

A modern, scalable React + TypeScript frontend application for the Flight Management System, integrating with microservices backend.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite
- **API Integration**: Clean API layer with axios for all microservices
- **Authentication**: JWT-based authentication with auto-login
- **State Management**: React Context API for global state
- **Responsive Design**: Mobile-first, fully responsive UI
- **Modern UI/UX**: Glassmorphism, gradients, smooth animations
- **Type Safety**: Full TypeScript support
- **Error Handling**: Comprehensive error handling and loading states

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/              # API integration layer
│   │   ├── client.ts     # Axios instance with interceptors
│   │   ├── auth.api.ts   # Authentication endpoints
│   │   ├── flight.api.ts # Flight search endpoints
│   │   ├── booking.api.ts # Booking endpoints
│   │   └── payment.api.ts # Payment endpoints
│   ├── components/       # Reusable components
│   │   ├── common/       # Shared UI components
│   │   └── layout/       # Layout components
│   ├── pages/            # Page components
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── styles/           # Global styles
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── router.tsx        # Route configuration
├── public/               # Static assets
├── .env.local            # Environment variables
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend services running (see root README)

### Installation

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Update the values in `.env.local`:
   ```env
   VITE_API_GATEWAY_URL=http://localhost:3000
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

## 🌐 API Integration

The frontend communicates with the backend through the API gateway running on port 3000. All API requests are proxied through Vite's dev server.

### Available Endpoints

#### Authentication (`/api/auth`)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

#### Flights (`/api/flights`)
- `GET /api/flights/search` - Search flights
- `GET /api/flights/airports` - Get all airports
- `GET /api/flights/:id` - Get flight by ID

#### Bookings (`/api/bookings`) - Protected
- `POST /api/bookings/create` - Create booking
- `GET /api/bookings/refrence/:ref` - Get booking by reference
- `POST /api/bookings/confirm/:ref` - Confirm booking
- `GET /api/bookings/mybookings` - Get user's bookings
- `PATCH /api/bookings/:ref/seats` - Update seats

#### Payments (`/api/payments`) - Protected
- `POST /api/payments/create` - Create payment intent

## 🎨 Design System

The application uses a modern design system with:

- **Dark Theme**: Sleek dark background with vibrant accents
- **Color Palette**: Primary (Indigo), Secondary (Purple), Accent (Pink)
- **Typography**: Inter font family
- **Components**: Glassmorphism cards, gradient buttons, smooth animations
- **Responsive**: Mobile-first design with breakpoints at 640px, 768px, 1024px

## 🔐 Authentication Flow

1. User registers or logs in
2. JWT token is stored in localStorage
3. Token is automatically attached to all API requests via axios interceptor
4. On 401 errors, user is redirected to login page
5. Auto-login on page refresh if valid token exists

## 📱 Pages

- **Home** (`/`) - Landing page with features
- **Login** (`/login`) - User login
- **Register** (`/register`) - User registration
- **Flight Search** (`/flights`) - Search and view flights
- **My Bookings** (`/my-bookings`) - View user bookings (protected)

## 🚧 Future Enhancements

- Booking creation flow
- Payment integration with Stripe
- User profile page
- Seat selection interface
- Booking modification/cancellation
- Email notifications
- Dark/Light theme toggle
- Advanced flight filters
- Price alerts

## 🐛 Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure:
- Backend gateway is running on port 3000
- All microservices are accessible from the gateway
- Vite proxy is configured correctly in `vite.config.ts`

### Build Errors
If TypeScript errors occur:
```bash
npm run type-check
```

Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is part of the Flight Management System.

## 👥 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

Built with ❤️ using React + TypeScript + Vite

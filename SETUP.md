# Haku - AI-Powered Resume & Job Application Assistant Frontend

This is the frontend application for the Haku AI-Powered Resume & Job Application Assistant, built with Next.js 15, React 19, and Tailwind CSS.

## Features

- **User Authentication**: JWT-based login and registration
- **Resume Management**: Upload, analyze, and optimize resumes with AI
- **Job Application Tracking**: Manage job applications with status tracking
- **AI-Powered Features**: Resume analysis, optimization, and cover letter generation
- **Dashboard**: Overview of resumes, applications, and AI usage
- **Profile Management**: User settings and subscription management

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: React 19 with Tailwind CSS
- **Icons**: Heroicons
- **Forms**: React Hook Form with validation
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Authentication**: JWT with context API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on http://localhost:3001

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment variables:
```bash
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── resumes/           # Resume management
│   ├── applications/      # Job application tracking
│   ├── profile/           # User profile settings
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── Navigation.tsx     # Main navigation
│   └── ProtectedRoute.tsx # Route protection
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── lib/                   # Utility functions
│   ├── api.ts            # API client configuration
│   └── utils.ts          # Helper functions
└── types/                 # TypeScript type definitions
    └── index.ts          # API response types
```

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Resume Management
- `POST /api/resume/upload` - Upload resume
- `POST /api/resume/analyze` - Analyze resume with AI
- `GET /api/resume` - Get user's resumes
- `DELETE /api/resume/:id` - Delete resume

### Job Applications
- `POST /api/job-application` - Create job application
- `GET /api/job-application` - Get job applications
- `PUT /api/job-application/:id` - Update application
- `DELETE /api/job-application/:id` - Delete application
- `POST /api/job-application/:id/cover-letter` - Generate cover letter

### Dashboard
- `GET /api/dashboard/overview` - Dashboard statistics
- `GET /api/dashboard/ai-usage` - AI usage statistics

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Code Style

The project uses:
- TypeScript for type safety
- Tailwind CSS for styling
- ESLint for code linting
- Prettier for code formatting

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

Or deploy to your preferred platform (Vercel, Netlify, etc.).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

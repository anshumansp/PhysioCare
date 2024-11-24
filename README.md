# PhysioAI Assistant

A modern physiotherapy clinic web application with AI-powered assistance, secure authentication, and appointment scheduling.

## Features

- 🔐 Secure authentication with email and Google Sign-in
- 🌙 Dark/Light mode
- 🤖 AI-powered chat assistant
- 📅 Online appointment scheduling
- 💨 Fast page loads with code splitting
- 🎨 Modern, responsive design
- ✨ Smooth animations and transitions
- 🔒 JWT-based authentication
- 🚀 CI/CD pipeline
- 📊 Error tracking and monitoring

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Zustand
- React Router DOM
- @react-oauth/google
- Sentry

### Backend
- Node.js
- Express
- MongoDB
- JWT
- Helmet
- Rate limiting
- MongoDB sanitize
- Compression

### DevOps
- Docker
- GitHub Actions
- Vercel
- Railway/Render
- MongoDB Atlas

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google OAuth credentials
- Docker (optional)

### Local Development

1. Clone the repository:
```bash
git clone [your-repo-url]
cd project
```

2. Install dependencies:
```bash
npm install
cd backend && npm install
```

3. Create environment files:

Frontend (.env):
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_SENTRY_DSN=your_sentry_dsn
```

Backend (backend/.env):
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
PORT=5000
```

4. Start the development servers:

Using npm:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend && npm run dev
```

Using Docker:
```bash
docker-compose up --build
```

### Production Deployment

1. Set up cloud services:
   - Create MongoDB Atlas cluster
   - Configure Google OAuth credentials
   - Set up Sentry project
   - Create Vercel account
   - Create Railway/Render account

2. Configure GitHub repository:
   - Add repository secrets for CI/CD
   - Enable GitHub Actions

3. Deploy:
   - Push to main branch
   - GitHub Actions will handle deployment
   - Monitor deployment status in Actions tab

## Project Structure

```
project/
├── src/                  # Frontend source code
│   ├── components/       # Reusable UI components
│   ├── context/         # React context providers
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── store/           # Zustand stores
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── backend/             # Backend source code
│   ├── src/             # Backend source files
│   ├── models/          # MongoDB models
│   └── routes/          # API routes
├── .github/             # GitHub Actions workflows
├── docker-compose.yml   # Docker compose config
└── Dockerfile          # Docker configuration
```

## Security Features

- JWT-based authentication
- Google OAuth integration
- Rate limiting
- Security headers
- MongoDB sanitization
- XSS protection
- CORS configuration
- Request size limits

## Monitoring and Error Tracking

- Sentry integration
- Morgan logging
- Error boundaries
- Performance monitoring
- User session replay

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@physioai.com or join our Slack channel.

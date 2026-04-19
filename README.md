# Change8 AdminJS eCommerce Dashboard

Role-Based eCommerce Admin Dashboard built with AdminJS, Sequelize, and PostgreSQL.

## Features

- User authentication and role-based access control
- Product, category, order, and user management
- Image uploads with Cloudinary
- Responsive dashboard UI
- AdminJS integration for easy resource management

## Getting Started

### Prerequisites

- Node.js (v16 or newer recommended)
- PostgreSQL database (local or cloud, e.g., Neon)

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd change8-adminjs-ecommerce-dashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your database and environment variables (see below).

### Running Locally

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000` by default.

### Database Sync

Before first run, sync your database schema:

```bash
npm run db:sync
```

To use alter mode (for migrations):

- PowerShell: `$env:DB_SYNC_ALTER="true"; npm run db:sync`
- CMD: `set DB_SYNC_ALTER=true && npm run db:sync`

## Environment Variables

Create a `.env` file or set these in your deployment environment:

- `DB_HOST` - Database host (e.g., localhost or Neon endpoint)
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret for JWT authentication
- `SESSION_SECRET` - Secret for session management
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `NODE_ENV` - Set to `development` or `production`

## Deployment

This project is ready for deployment on Vercel or any Node.js hosting platform. Make sure to set all required environment variables in your deployment settings.

## Folder Structure

- `admin/` - React components for AdminJS dashboard
- `api/` - API endpoints
- `controllers/` - Express controllers
- `middleware/` - Authentication and role middleware
- `model/` and `models/` - Sequelize models
- `routes/` - Express routes
- `public/` - Static assets
- `config/` - Configuration files

## License

MIT

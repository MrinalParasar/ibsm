# Admin Panel Setup Guide

## Prerequisites

1. MongoDB database (local or MongoDB Atlas)
2. Node.js and npm installed

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/ibsm-admin
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ibsm-admin?retryWrites=true&w=majority

# JWT Secret Key (generate a strong random string)
JWT_SECRET=your-secret-key-change-in-production-use-strong-random-string

# Admin Registration Secret
# This secret is required to register new admin users via API
# Generate a strong random string: openssl rand -base64 32
ADMIN_REGISTER_SECRET=your-admin-register-secret-key
```

To generate secure secrets:
```bash
openssl rand -base64 32
```

## Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

## Registering Admin Users

Admin registration is only available via API using curl or similar tools. The registration UI has been removed for security.

**Register a new admin user:**
```bash
curl -X POST http://localhost:3000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-secure-password",
    "name": "Admin Name",
    "secretPass": "your-admin-register-secret-key"
  }'
```

Replace `your-admin-register-secret-key` with the value from your `ADMIN_REGISTER_SECRET` environment variable.

## Accessing the Admin Panel

1. **Login to admin panel:**
   - Navigate to: `http://localhost:3000/admin/login`
   - Use your registered credentials

2. **Admin Dashboard:**
   - After login, you'll be redirected to: `http://localhost:3000/admin`
   - This is the admin landing page

## Security Notes

- The admin panel routes are not linked from the main website UI
- Access is only through direct URL navigation
- Admin registration is only available via API with a secret pass (no UI)
- JWT tokens are stored in localStorage
- Tokens expire after 7 days
- Passwords are hashed using bcrypt

## API Endpoints

- `POST /api/admin/register` - Register a new admin user (requires `secretPass` in request body matching `ADMIN_REGISTER_SECRET`)
- `POST /api/admin/login` - Login and get JWT token
- `GET /api/admin/me` - Get current admin user info (requires authentication)

### Register API Example

```bash
curl -X POST http://localhost:3000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securepassword123",
    "name": "John Doe",
    "secretPass": "your-admin-register-secret-key"
  }'
```

**Response:**
```json
{
  "message": "Admin user created successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "admin@example.com",
    "name": "John Doe"
  }
}
```

## Database Structure

The admin users are stored in the `admins` collection with the following schema:

```typescript
{
  _id: ObjectId,
  email: string,
  password: string (hashed),
  name: string,
  createdAt: Date,
  updatedAt: Date
}
```


# TechVerse

A beginner-friendly MERN stack ecommerce project for college-level learning.

## Setup

### Backend
1. Open `Techverse-Backend/.env` and verify your MongoDB URI:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/techverse
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   PORT=5000
   ```
2. Install dependencies:
   ```bash
   cd Techverse-Backend
   npm install
   ```
3. Run the server:
   ```bash
   npm run dev
   ```
4. Seed sample data:
   ```bash
   npm run seed
   ```

### Frontend
1. Install dependencies:
   ```bash
   cd Techverse-Frontend
   npm install
   ```
2. Run the app:
   ```bash
   npm run dev
   ```

## MongoDB Compass: Create and Connect a Collection

1. Open MongoDB Compass.
2. Click `Connect` and use the same URI as in `.env`:
   ```text
   mongodb://127.0.0.1:27017/techverse
   ```
3. After connecting, click the `techverse` database in the left sidebar.
4. If the database does not exist yet, Compass will create it when you insert data.
5. Click `Create Collection`.
6. Name it `users`, `products`, `categories`, or `orders`.
7. Insert documents manually or run the backend seed script to populate sample data.

## How the backend connects

- The backend reads `MONGO_URI` from `.env`.
- `Techverse-Backend/config/db.js` uses that URI to connect with Mongoose.
- Collections are created automatically when data is saved.

## Example MongoDB Compass use

- Create `techverse` database and a `products` collection.
- Add a simple document:
  ```json
  {
    "name": "Example Product",
    "brand": "TechVerse",
    "category": "Audio",
    "description": "Example description.",
    "price": 99.99,
    "stock": 10
  }
  ```
- Refresh Compass; your backend can now read/write this collection.

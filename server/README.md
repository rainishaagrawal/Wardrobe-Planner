# AI Personal Wardrobe Assistant Backend

The complete backend for the AI Personal Wardrobe Assistant, supporting full wardrobe management, deterministic combinatorial recommendations, user feedback and long-term style learning, a 7-day automated outfit planner, inspiration image extraction, and comprehensive read-only wardrobe analytics.

## Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create an environment file `.env` from `.env.example`.
   Ensure you have a valid local or remote MongoDB running.

3. Start the server:
   ```bash
   npm run dev
   ```

## Environment variables

- `PORT`: Port the server runs on (e.g. 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for signing JWT tokens

## API Modules

The following route groups are available. All protected routes require a `Bearer <token>` Authorization header.

- `/auth`: Register, login, get current user
- `/profile`: View and update user profile info (name, location, onboarding)
- `/style`: Manage StyleProfile and dynamic temporary preferences
- `/wardrobe`: Full CRUD operations for clothing items, tracking clean/dirty and availability
- `/outfits`: Generate combinatorial outfit templates, retrieve histories, style around specific anchors, and save/wear them
- `/feedback`: Post likes/dislikes on generated outfits to fuel the learning engine
- `/weekly-plan`: Automate outfit generation across 7 days with built-in variety scoring and repetition avoidance
- `/inspiration`: Convert reference images/URLs into parsed style signals using the mock deterministic visual analyzer
- `/analytics`: Dashboard data covering wardrobe utilization, outfit metrics, feedback trends, and parsed deterministic insights

*Note: The AI vision analyzer, the weather APIs, and remote image storage are currently using mock/deterministic implementations. Real API integration is planned for a future phase.*

## STF Miniapp Server — Beginner-Friendly Guide

This is a minimal, boilerplate backend for the STF Miniapp. It’s built with Node.js, Express, and Mongoose, and organized so you can easily add new features (tasks, points, social, users) as your app grows.

This README walks you through everything step by step—from installing tools to running the server, understanding the code, and adding your first route. Follow it in order and you’ll be up and running quickly.

---

## What you’ll build

- A Node.js server that:
  - Boots Express and exposes a health endpoint at `/health` and a test endpoint at `/api/v1/test`
  - Connects to MongoDB using Mongoose (local or Atlas)
  - Uses JSON parsing and CORS
  - Returns consistent 404 and 500 error responses

---

## Prerequisites

Install these first:

- Node.js 18+ (recommended LTS)
- pnpm (preferred) or npm
- MongoDB
  - Local MongoDB Community Server, or
  - A MongoDB Atlas connection string

Check your versions:

```bash
node -v
pnpm -v   # or: npm -v
```

---

## Project structure (server only)

```
stf-miniapp-server/
	.env                 # Your environment variables (not committed)
	package.json         # Scripts and package metadata
	pnpm-lock.yaml       # Lockfile for pnpm
	src/
		app.js             # Express app, middleware, error handlers, routes mounting
		server.js          # Entry point: connects to MongoDB and starts HTTP server
		routes.js          # Main router under /api/v1, includes /test endpoint
		point/             # Feature area placeholder (empty for now)
		social/            # Feature area placeholder (empty for now)
		task/              # Feature area placeholder (empty for now)
		task_completed/    # Feature area placeholder (empty for now)
		user/              # Feature area placeholder (empty for now)
```

Those feature folders are scaffolding—you’ll add controllers/models/routes there as you implement features.

---

## 1) Install dependencies

From the `stf-miniapp-server` folder:

```bash
# Using pnpm (recommended)
pnpm add express cors dotenv mongoose

# If you want nodemon for auto-restart during development
pnpm add -D nodemon

# If you prefer npm instead of pnpm, use:
# npm install express cors dotenv mongoose
# npm install -D nodemon
```

Why these packages?

- express: web framework
- cors: Cross-Origin Resource Sharing middleware
- dotenv: loads variables from `.env`
- mongoose: MongoDB ODM
- nodemon (dev): restarts the server on file changes

---

## 2) Create your .env file

In `stf-miniapp-server/.env` add the following (adjust values to your setup):

```env
# Server
PORT=3000
MODE=DEV          # or PROD

# Database
MONGO_URI=mongodb://localhost:27017/sft-miniapp
# Example Atlas format:
# MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
```

Notes:

- If `PORT` isn’t set, the server defaults to 3000.
- If `MONGO_URI` isn’t set, it defaults to `mongodb://localhost:27017/sft-miniapp`.
- `MODE=DEV` makes the error handler include stack traces in responses.

---

## 3) How the server starts (under the hood)

The entry point is `src/server.js`:

- Loads `app` from `src/app.js`
- Reads `PORT` and `MONGO_URI` from environment
- Connects to MongoDB using `mongoose.connect(MONGO_URI)`
- Starts Express: `app.listen(PORT)`

Express `app` is defined in `src/app.js`:

- `express.json()` for parsing JSON bodies
- `cors({ origin: "*", credentials: true })` to allow cross-origin requests
- Mounts the main routes at `/api/v1`
- 404 handler for unknown routes
- Error handler:
  - If `MODE=DEV`, includes error stack traces
  - Otherwise, returns a generic message
- A health route at `/health` that returns `{ status: "ok" }`

The routes live in `src/routes.js` right now:

- Defines `GET /api/v1/test` that responds with "Test route is working"

---

## 4) Run the server

There are scripts in `package.json` you can use:

````json
{
	"scripts": {
		"dev": "nodemon src/server.js",
		"start": "node src/server.js"
	}
}
``;

Start in development (auto-restart on changes):

```bash
pnpm dev
````

Start in production mode:

```bash
pnpm start
```

If you’re using npm:

```bash
npm run dev
# or
npm start
```

When it’s running, you should see a log like:

```
Server running at http://localhost:3000
```

---

## 5) Test the endpoints

Once the server is running:

- Health check

  - URL: `GET http://localhost:3000/health`
  - Response: `{ "status": "ok" }`

- Test route
  - URL: `GET http://localhost:3000/api/v1/test`
  - Response: `"Test route is working"`

You can open these in a browser or use curl/Postman.

---

## 6) Add your first custom route (example)

Let’s add a simple “hello” route under `/api/v1/hello`.

1. Open `src/routes.js`
2. Add a new handler:

```js
MainRoutes.get("/hello", (req, res) => {
  res.json({ message: "Hello from STF Miniapp Server" });
});
```

3. Save the file and hit:
   - `GET http://localhost:3000/api/v1/hello`
   - You should receive `{ "message": "Hello from STF Miniapp Server" }`

Tip: Keep feature-specific routes in their own files/folders (e.g., `src/user/routes.js`) and import/mount them from `routes.js`.

---

## 7) Connecting to MongoDB and creating models

Mongoose connects in `src/server.js`. To start modeling data:

1. Create a model, e.g., `src/user/user.model.js`:

```js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    telegramId: { type: String, required: true, unique: true },
    username: { type: String },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
```

2. Use it in a route (e.g., `src/user/routes.js`) and mount it in `src/routes.js`.

Remember: you must restart the server if you’re not using nodemon.

---

## 8) CORS, 404s, and error handling

- CORS is open to all origins by default: `origin: "*"`.
  - For production, tighten this to your frontend’s origin.
- Unknown routes return a 404 JSON payload:
  ```json
  { "msg": "No routes in this location", "statusCode": 404, "data": null }
  ```
- Errors are centralized:
  - In DEV mode, you’ll get `{ msg, stack, statusCode: 500, data: null }`
  - In PROD mode, you’ll get a generic 500 response without stack

---

## 9) Common issues and fixes

- Cannot connect to MongoDB
  - Ensure MongoDB is running locally or your Atlas URI is correct
  - Verify `MONGO_URI` in `.env`
- Port already in use
  - Change `PORT` in `.env` or free the port
- CORS errors in the browser
  - Update the `cors` config in `src/app.js` to allow your frontend origin
- 404 on your new route
  - Confirm it’s mounted under `/api/v1` and the path is correct

---

## 10) Scripts and useful commands

```bash
# Install deps
pnpm install

# Start dev server with nodemon (hot reload)
pnpm dev

# Start production server
pnpm start
```

If using npm:

```bash
npm install
npm run dev
npm start
```

---

## 11) Next steps (suggested)

- Define route files for each feature folder: `point`, `social`, `task`, `task_completed`, `user`
- Add controllers/services for business logic
- Create Mongoose models and connect routes to the database
- Add validation (e.g., zod or express-validator)
- Add authentication if needed (JWT/session)
- Add logging (e.g., morgan, pino)
- Write tests (Jest/Supertest) and GitHub Actions for CI

---

## FAQ

Q: Do I need MongoDB running to hit `/health` and `/api/v1/test`?

- `/health` works regardless. `/api/v1/test` also works, but the server won’t start if it fails to connect to MongoDB; keep Mongo running or point `MONGO_URI` to a working instance.

Q: Why pnpm?

- This repo includes a `pnpm-lock.yaml`. pnpm is fast and space-efficient. You can use npm if you prefer.

---

## Support

If you get stuck, open an issue or share the exact error message and your `.env` (redact secrets). I’ll help you fix it step by step.

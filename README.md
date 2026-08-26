# BrewRoute 🍺

A smart, AI-powered craft beer itinerary and microbrewery road-trip planner.

---

## 🚀 Deploying to Netlify

This project is pre-configured for **Netlify** with automatic serverless functions for the Gemini API backend and Single Page Application (SPA) routing.

### Step 1: Connect your Repository to Netlify
1. Export this project to **GitHub** via AI Studio's settings menu (or push your repository to GitHub/GitLab).
2. Log in to [Netlify](https://app.netlify.com) and click **Add new site** > **Import an existing project**.
3. Select your repository.

### Step 2: Build Settings
Netlify will automatically detect `netlify.toml`. Verify the following settings:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`

### Step 3: Set Environment Variables in Netlify
Go to **Site Configuration** > **Environment variables** > **Add a variable**:
- `GEMINI_API_KEY`: Your Google Gemini API Key (Get a free key at [Google AI Studio](https://aistudio.google.com/apikey)).
- `NODE_VERSION`: `20`

Click **Deploy Site**!

---

## 💻 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your `GEMINI_API_KEY`.

3. Run the development server:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`.

---

## 🛠️ Project Structure
- `src/`: React 19 frontend application with Tailwind CSS and Leaflet maps.
- `server/app.ts`: Express API router handling `/api/generate-route` and `/api/health`.
- `netlify/functions/api.ts`: Netlify Serverless Function wrapper powered by `serverless-http`.
- `netlify.toml`: Netlify build configuration and routing rules.
- `server.ts`: Node.js development and standalone production server.

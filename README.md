# BrewHop 🍺

A smart, AI-powered craft beer itinerary and microbrewery road-trip planner.

---

## 🚀 Deploying to Netlify

This project is pre-configured for **Netlify** with automatic serverless functions for the Gemini API backend, built-in **Netlify Forms**, and Single Page Application (SPA) routing.

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

## 📬 Contact Form with Netlify Forms (No SMTP Needed)

The contact form is configured strictly according to the [Official Netlify Forms Documentation](https://docs.netlify.com/manage/forms/setup/):
- **Built-in Serverless Processing**: Netlify automatically intercepts POST submissions at `/` with `application/x-www-form-urlencoded` data. No SMTP credentials or backend mailing libraries required.
- **Dual HTML Discovery**:
  - `index.html` and `public/__forms.html` provide static mirror forms with `method="POST"`, `data-netlify="true"`, and `netlify-honeypot="bot-field"` so Netlify's build bots register the form automatically during deployment.
- **React SPA Submission**:
  - Uses `URLSearchParams` with `form-name: contact` and anti-spam honeypot verification.
- **Bot Protection**: Includes a honeypot field (`bot-field`) and automated Akismet spam filtering.
- **Email Notifications**:
  1. Open your project in the [Netlify Dashboard](https://app.netlify.com).
  2. Navigate to **Site configuration** > **Forms** > **Form notifications**.
  3. Click **Add notification** > **Email notification**.
  4. Select `contact` form and enter your destination email address (e.g. `mainfo42@gmail.com`).
- **Submission History**: All entries are permanently stored and viewable under the **Forms** tab in Netlify.

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

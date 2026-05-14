# Vibin

Vibin (Vibe In) is a simple weekend-planning app for Bangalore. It helps users create a short, practical plan based on their mood, available time, budget, interests, location notes, and constraints.

The goal is not to overload the user with choices. Vibin asks a few focused questions, searches for relevant places, and returns a clean route-like plan with activities, food stops, estimated cost, and transport cost.

Live app: https://vibin-xi.vercel.app/

## Submission

- Live URL: https://vibin-xi.vercel.app/
- Focus city: Bangalore
- Repo includes local setup instructions below.

## What It Does

- Plans a weekend outing in Bangalore.
- Uses user inputs such as mood, interests, budget, time, constraints, and free-text notes.
- Supports constraints like vegetarian, avoid crowds, indoors only, outdoors only, child friendly, pet friendly, wheelchair accessible, and no alcohol.
- Uses AI/web search through a backend API to find current recommendations.
- Falls back to local Bangalore mock data if the live planner is unavailable.
- Keeps the UI simple so users can move from input to plan without confusion.

## Budget Philosophy

Vibin does not try to spend the full user budget.

If the budget is above roughly `Rs.1,500`, the planner should usually use only around `30-40%` of the budget. This leaves room for real-world extra spending such as:

- transport changes
- snacks or drinks
- surge pricing
- entry fee differences
- impulse purchases
- tips, parking, or small add-ons

This makes the plan more realistic and easier for the user to manage.

## Tech Stack

- React
- Create React App
- Node.js backend server
- OpenRouter API for AI planning and web-search powered recommendations
- Local fallback data for Bangalore

## Run Locally

Prerequisites:

- Node.js installed
- npm installed
- OpenRouter API key

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
OPENROUTER_API_KEY=your_openrouter_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini
```

Start the app:

```bash
npm.cmd start
```

This starts:

- React frontend: `http://localhost:3000`
- Backend API: `http://localhost:8787`

If port `3000` is already busy, React may ask to run on `3001`.

Check backend health:

```text
http://localhost:8787/api/health
```

Create a production build:

```bash
npm.cmd run build
```

Serve the production build locally:

```bash
npm.cmd run serve
```

## How Planning Works

1. The user enters budget, available time, mood, interests, constraints, and optional notes.
2. The frontend combines all user inputs into one planning request.
3. The backend sends the request to the AI/web-search planner.
4. The planner returns a structured weekend plan.
5. The app validates and displays:
   - activity stops
   - food stops
   - estimated activity cost
   - estimated food cost
   - estimated transport cost
   - total estimated cost
6. If live search fails, the app uses local Bangalore fallback data.

## AI Tools Used

I used AI coding tools to quickly iterate on the React UI, backend planner flow, and prompt structure.
AI also helped debug local API routing, fallback behavior, and budget/transport logic.
Final decisions were guided by product simplicity: a usable hosted planner with trace, fallback, and practical recommendations.

## Future Advancements

1. **Google Maps circuits**

   Each plan should become a proper route circuit. Every stop will include a Google Maps link, and the app will arrange places in a sensible travel order.

2. **Place reviews**

   Each recommendation should show useful review signals, such as rating, review count, common complaints, and why the place is worth visiting.

3. **Public and private plans**

   Users should be able to mark their plan as public or private.

   If a plan is public, other users with a similar route, mood, or weekend circuit can be notified. They can then choose to join, coordinate, or adjust their own plan.

4. **Generated preview cards**

   Before the final plan, Vibin can show a few visual itinerary cards so users feel excited about the direction of the outing.

5. **Shareable itinerary cards**

   Users should be able to export a clean weekend card that can be sent to friends or posted as an Instagram-story style image.

6. **Send to friends**

   Add a lightweight sharing flow so users can send a plan to friends and coordinate without copying long text manually.

7. **More personality**

   Add richer mood styling, small motion details, rotating suggestions, and more playful plan language while keeping the interface simple.

## Current Status

Vibin is an early version focused on simple weekend planning for Bangalore. The main product direction is to keep the interface lightweight while making the recommendations more useful, current, and route-aware over time.

# AI Personal Wardrobe Assistant - Frontend

The frontend is a React + Vite application that interfaces with the Wardrobe AI Express/MongoDB backend. It focuses on presenting a premium, editorial, and fashion-focused experience that champions the philosophy: **Don't Buy — Style What You Own.**

## Setup

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## Environment

You must have a running backend server. Create a \`.env\` file based on \`.env.example\`:

\`\`\`text
VITE_API_BASE_URL=http://localhost:5000/api
\`\`\`

## Production build

\`\`\`bash
npm run build
\`\`\`

## Architecture

The frontend follows a clean presentation and orchestration layer structure. It intentionally pushes complex AI, recommendation, and learning logic down to the backend.

- **pages/**: Route-level components mapping directly to user paths (e.g., Dashboard, Wardrobe, Inspiration).
- **components/**: Modular UI elements categorized by domain (wardrobe, outfits, planner, inspiration, common).
- **services/**: Axios-based API interfaces communicating with the Node.js backend.
- **context/**: Global state restricted to Authentication (AuthContext). No Redux or complex state managers are used.
- **hooks/**: Custom React hooks for localized feature state (e.g., `useOutfitRecommendations`).
- **routes/**: Protected, public, and onboarding routing logic.
- **styles/**: Minimal, variable-driven CSS following the established design system (warm off-white, editorial typography).

## PWA and Offline Support

The application includes basic PWA configurations via \`manifest.json\`, allowing standalone installation. 

**Note on Caching:** Because the application relies heavily on real-time, authenticated, and personalized backend recommendations (including AI analysis and outfit scoring), we do not aggressively cache API responses. An offline banner will automatically appear if network connectivity drops, advising users that feature availability is limited until reconnection.

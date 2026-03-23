# Quality ba riyan (QBR) MVP - Walkthrough

## Overview
The QBR MVP has been successfully implemented using Vite, React, TailwindCSS (v4), and GSAP with Lenis for smooth scrolling. It provides a stunning, responsive dark-mode interface for monitoring air quality using real-time data from the **IQAir API**.

### Changes Made

#### Project Setup
- Bootstrapped Vite in the provided repository directory.
- Configured Vite with TailwindCSS v4 and installed necessary layout dependencies (`@studio-freight/lenis`, `gsap`, `axios`, `lucide-react`).

#### Core Logic
- **`useGeolocation.js`**: Custom hook that natively maps the user's browser geolocation coordinates.
- **`iqairService.js`**: Axios wrappers for `nearest_city` (geolocation fallback) and `city` (searches location by input string).
- **`aqiUtils.js`**: Mapper logic that translates AQI numbers (e.g., `120`) into dynamic text labels (`Unhealthy for Sensitive Groups`), vibrant colors, and safety messages.
- **`notificationUtils.js`**: Hooks into the native browser Notification API. Includes an automated check that triggers an alert when AQI exceeds 100.

#### Frontend Components
1. **`HeroSection.jsx`**: The focal point of the app, heavily powered by GSAP entrance animations. Shows the massive AQI value dynamically mapped to colors. Contains a reserved section explicitly styled placeholder container for complex 3D Spline implementations in the future.
2. **`RecommendationBanner.jsx`**: Responsive banner presenting dynamic health recommendations and visual iconography based on AQI levels.
3. **`PollutantCards.jsx`**: A set of cards designed to render individual pollutants like PM2.5, PM10, and CO. Uses estimated conversions based on the main AQI for visual purposes, accounting for the limitations of IQAir's free tier.
4. **`SmoothScroll.jsx`**: The Lenis + GSAP synchronization provider, creating the "buttery smooth" scroll inertia found on premium sites.

### Setup Instructions
1. Navigate to the project folder (`c:\Users\USER\OneDrive\Documents\GitHub\quality-ba-riyan-website`).
2. Add your IQAir API key inside the `.env` file (replacing the placeholder).
   ```bash
   VITE_IQAIR_API_KEY=YOUR_KEY_HERE
   ```
3. Run `npm install` to ensure packages are fully resolved.
4. Run `npm run dev` to start the frontend server locally.

### 3D Spline Integration Future Scope
The right-side container inside the Hero section is perfectly scaled and responsive to embed an `<iframe src="YOUR_SPLINE_URL">` or a `<Spline scene="YOUR_SPLINE_URL" />` component seamlessly right where "3D Spline Scene Placeholder" is currently written!

# AlwaysUp - Website Uptime Monitoring

This is a Next.js application built with Firebase Studio for monitoring website uptime.

## Core Features:

- **Uptime Monitoring**: Periodically checks the status of provided website URLs.
- **Status Display**: Shows whether monitored websites are 'up', 'down', 'checking', or in an 'error' state.
- **Simple Interface**: Add URLs easily and view the status list.
- **Free Tier**: Monitor up to 5 websites for free with 5-minute check intervals.
- **Pricing Tiers**: Upgrade for more monitors and faster (1-minute) checks. Prices displayed in INR.
- **Details**: Expand each monitor entry to see the last check time, status code, and any error messages.

## Getting Started:

- Navigate to `src/app/page.tsx` to see the main dashboard component.
- The core monitoring logic (currently simulated client-side) is in `src/services/uptime-checker.ts`.
- Pricing information is available on the `/pricing` page (`src/app/pricing/page.tsx`).

## Running Locally:

1.  Install dependencies: `npm install`
2.  Run the development server: `npm run dev`
3.  Open [http://localhost:9002](http://localhost:9002) (or your configured port) in your browser.

## Important Notes:

- **Monitoring**: The current uptime checks are simulated client-side in `src/services/uptime-checker.ts`. For a production application, these checks **must** be moved to a reliable backend service to avoid CORS issues and ensure consistent monitoring.
- **Payment Gateway**: The pricing page mentions PhonePe and UPI payments. However, **actual payment integration is not implemented**. The upgrade buttons on the pricing page are placeholders and will not initiate real transactions. A full backend integration with PhonePe's API is required for live payments.
- **Persistence**: Website data is currently stored in the browser's Local Storage. For a multi-user or persistent application, this data should be stored in a database (like Firestore).

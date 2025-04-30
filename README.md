# AlwaysUp - Website Uptime Monitoring

This is a Next.js application built with Firebase Studio for monitoring website uptime.

## Core Features:

- **Uptime Monitoring**: Periodically checks the status of provided website URLs using server-side fetch.
- **Status Display**: Shows whether monitored websites are 'up', 'down', 'checking', or in an 'error' state.
- **Simple Interface**: Add URLs easily and view the status list.
- **History**: Expand entries to view recent check history (timestamps, status codes, errors).
- **Persistence**: Uses Prisma with a Neon PostgreSQL database to store website data and check history.
- **Free Tier**: Monitor up to 5 websites for free.
- **Pricing Tiers**: Upgrade options for more monitors (details on pricing page). Prices displayed in INR.

## Prerequisites (VERY IMPORTANT!)

- **Node.js and npm**: Ensure you have a recent version installed.
- **Linux OpenSSL 1.1 Library**:
    - **Problem**: This application relies on Prisma to connect to the Neon database. Prisma's database engine *requires* the `libssl.so.1.1` library file on Linux systems. If this library is missing, you **will** encounter a `PrismaClientInitializationError` when the application tries to access the database (e.g., on page load, when adding a site). The error message will explicitly mention `libssl.so.1.1: cannot open shared object file`.
    - **Solution**: You **MUST** install the OpenSSL 1.1 library on the system where you are running or building this application (e.g., your development machine, server, container, or build environment).
        - **For Debian/Ubuntu**:
          ```bash
          sudo apt update && sudo apt install libssl1.1
          ```
        - **For Other Linux Distributions**: The package name might differ (e.g., `openssl-libs` on CentOS/Fedora, but confirm it provides version 1.1). Search your distribution's package manager for `openssl` version 1.1.
        - **Verification**: After installation, **restart the application**. The `libssl.so.1.1` error should no longer appear when the app tries to interact with the database. **If the error persists, the installation was not successful or you need to restart your environment.**

## Getting Started:

1.  **Environment Setup**:
    *   Create a `.env` file in the root directory. Add your Neon database connection string:
        ```
        DATABASE_URL="postgresql://neondb_owner:npg_0SK6RWbodElI@ep-nameless-cloud-a4bum3t7-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
        ```
    *   **Crucially**, ensure you have installed `libssl1.1` as described in the **Prerequisites** section above if you are on Linux.

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Database Migration**: Apply the database schema:
    ```bash
    npx prisma db push
    ```
    *(Note: `npx prisma migrate dev` is preferred for development workflows to track schema changes, but `db push` is simpler for initial setup).*

4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    *If you encounter the `libssl.so.1.1` error here, stop the server, verify the OpenSSL installation (Prerequisites step), and then try running `npm run dev` again.*

5.  **Open the App**: Navigate to [http://localhost:9002](http://localhost:9002) (or your configured port) in your browser.

## Important Notes:

- **Monitoring**: Uptime checks are performed server-side using `fetch` in `src/server/services/uptime.ts`. A background job (cron job or similar) would be needed for *automatic* periodic checks in a production environment. Currently, checks happen on adding a site or manual trigger.
- **Payment Gateway**: The pricing page mentions PhonePe and UPI payments. However, **actual payment integration is not implemented**. The upgrade buttons on the pricing page are placeholders and will not initiate real transactions. A full backend integration with PhonePe's API is required for live payments.
- **Authentication/Authorization**: There is currently no user authentication. The free tier limit is applied globally. A real application would require user accounts to manage monitors and plans.

## Project Structure:

- `src/app/`: Next.js App Router pages and layouts.
- `src/components/`: Reusable React components (including ShadCN UI).
- `src/server/`: Backend-specific code.
  - `db/prisma.ts`: Prisma client instance.
  - `services/uptime.ts`: Server-side uptime checking logic.
- `src/app/actions.ts`: Next.js Server Actions for form submissions and data fetching/mutation.
- `prisma/`: Database schema and migrations.
- `public/`: Static assets.

```
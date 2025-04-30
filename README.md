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

## Prerequisites (CRITICAL - READ AND FOLLOW CAREFULLY!)

- **Node.js and npm**: Ensure you have a recent version installed.
- **Linux OpenSSL 1.1 Library (`libssl.so.1.1`)**:
    - **Problem**: This application uses Prisma to interact with the Neon database. On **Linux** systems (including development machines, servers, Docker containers, WSL, build environments), Prisma's database engine **ABSOLUTELY REQUIRES** the `libssl.so.1.1` shared library file.
    - **Symptom**: If this specific library file (`libssl.so.1.1`) is missing or cannot be found by Prisma, you **WILL** encounter a `PrismaClientInitializationError` when the application tries to connect to the database. This typically happens when:
        - Starting the development server (`npm run dev`).
        - Loading the main page (which fetches data).
        - Adding a new website (which writes data).
        - Manually checking a website (which writes history).
    - **The Error Message Will Look Like This**:
      ```
      PrismaClientInitializationError:
      ... Unable to require(`/path/to/your/project/node_modules/.prisma/client/libquery_engine-...so.node`).
      Prisma cannot find the required `libssl` system library...
      Please install openssl and try again.
      Details: libssl.so.1.1: cannot open shared object file: No such file or directory
      ```
      **If you see this error, it means `libssl.so.1.1` is missing or inaccessible.**
    - **Solution**: **YOU MUST INSTALL OpenSSL version 1.1** on your Linux system. **Merely having a newer OpenSSL version (like 3.x) installed is NOT enough; Prisma specifically needs `libssl.so.1.1`.**
        - **For Debian/Ubuntu (like Ubuntu 20.04, 22.04+)**:
          ```bash
          # 1. Run this command in your terminal:
          sudo apt update && sudo apt install -y libssl1.1
          # The '-y' flag automatically confirms the installation.
          ```
        - **For Other Linux Distributions (e.g., Fedora, CentOS, Arch)**: You need to find the package that provides `libssl.so.1.1`. The package name might be `openssl-libs`, `openssl1.1`, or similar. **Crucially, verify it provides version 1.1.** Consult your distribution's package manager documentation.
            - *Example (may vary)*: `sudo dnf install openssl1.1` or `sudo yum install openssl1.1-libs`
        - **Verification (IMPORTANT!)**:
            1.  After running the install command, **check for errors** during the installation process.
            2.  Try to locate the file: `ls /usr/lib/x86_664-linux-gnu/libssl.so.1.1` (path might differ slightly on other distros, check common lib directories like `/lib64`, `/usr/lib64`). If the command shows the file, the installation was likely successful. If it says "No such file or directory", the installation failed or the file is elsewhere.
        - **FULL Environment RESTART (ABSOLUTELY CRUCIAL!)**:
            1.  **STOP** the Next.js development server (Ctrl+C in the terminal where `npm run dev` is running).
            2.  **CLOSE** your code editor (like VS Code, Zed, etc.) completely.
            3.  **CLOSE** any terminals that were involved in running the app, build processes, or Prisma commands.
            4.  **If using Docker**: Stop and **restart** the relevant container (`docker restart <container_name>`).
            5.  **If using WSL**: You might need to restart the WSL instance (`wsl --shutdown` in PowerShell/CMD, then reopen your WSL terminal).
            6.  **A simple `npm run dev` restart is NOT enough.** System library paths are often cached. You need to ensure all processes related to the project are fully terminated and restarted.
        - **Retry**:
            1.  Open a **NEW** terminal.
            2.  Navigate to your project directory.
            3.  Run `npm run dev` again.
            4.  **If the `libssl.so.1.1` error persists**:
                - Double-check the installation command for your specific Linux version.
                - Verify the file exists using `ls` or `find / -name libssl.so.1.1 2>/dev/null`.
                - Ensure you performed a **COMPLETE** environment restart. Repeat the restart steps meticulously.
                - Consider potential path issues (though usually handled by `ldconfig`).

## Getting Started:

1.  **Environment Setup**:
    *   Create a `.env` file in the root directory. Add your Neon database connection string:
        ```
        DATABASE_URL="postgresql://neondb_owner:npg_0SK6RWbodElI@ep-nameless-cloud-a4bum3t7-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
        ```
    *   **Linux Users**: **STOP!** Have you installed `libssl1.1` and performed a **FULL ENVIRONMENT RESTART** as described in the **Prerequisites** section? **THE APP WILL NOT WORK WITHOUT IT.**

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
    *If you encounter the `libssl.so.1.1` error here, **STOP**, go back to the **Prerequisites** section, **VERIFY** the OpenSSL 1.1 installation and **RESTART** your environment **FULLY**, then try `npm run dev` again.*

5.  **Open the App**: Navigate to [http://localhost:9002](http://localhost:9002) (or your configured port) in your browser.

## Important Notes:

- **Monitoring**: Uptime checks are performed server-side using `fetch` in `src/server/services/uptime.ts`. A background job (cron job or similar) would be needed for *automatic* periodic checks in a production environment. Currently, checks happen on adding a site or manual trigger via the refresh button.
- **Payment Gateway**: The pricing page mentions PhonePe and UPI payments. However, **actual payment integration is not implemented**. The upgrade buttons on the pricing page are placeholders and will not initiate real transactions. A full backend integration with PhonePe's API is required for live payments.
- **Authentication/Authorization**: There is currently no user authentication. The free tier limit is applied globally. A real application would require user accounts to manage monitors and plans.

## Project Structure:

- `src/app/`: Next.js App Router pages and layouts.
- `src/components/`: Reusable React components (including ShadCN UI).
- `src/server/`: Backend-specific code.
  - `db/prisma.ts`: Prisma client instance.
  - `services/uptime.ts`: Server-side uptime checking logic.
- `src/app/actions.ts`: Next.js Server Actions for form submissions and data fetching/mutation.
- `prisma/`: Database schema (`schema.prisma`).
- `public/`: Static assets.
```
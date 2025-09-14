# Deployment Guide

This guide provides instructions on how to set up and run the Todo List application on a new machine.

## Prerequisites

Before you begin, ensure that the following software is installed on your machine:

*   **Node.js** (LTS version recommended)
*   **npm** (Node Package Manager, usually comes with Node.js)
*   **Git** (for cloning the repository)

## 1. Clone the Repository

First, you need to get the project code onto your new PC. Open your terminal or command prompt and run the following command:

```bash
git clone <your-repository-url>
cd todolist
```

Replace `<your-repository-url>` with the actual URL of your Git repository.

## 2. Backend Setup and Run

The backend server is responsible for data storage and API handling.

1.  **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the backend server:**

    ```bash
    node server.js
    ```

    The server will start on `http://localhost:3001`. Keep this terminal window open as long as you want the server to be running.

## 3. Frontend Setup and Run

The frontend application provides the user interface.

1.  **Navigate to the frontend directory (in a new terminal window/tab):**

    ```bash
    cd ../todolist-app
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Build the frontend application:**

    ```bash
    npm run build
    ```

    This command will create production-ready static files in the `dist` directory.

4.  **Serve the built application:**

    You will need a simple web server to serve the static files. `serve` is a convenient package for this.

    *   If `serve` is not installed globally, install it:

        ```bash
        npm install -g serve
        ```

    *   Serve the application from the `dist` directory:

        ```bash
        serve -s dist
        ```

    This command will typically run the frontend application on `http://localhost:5000` (or another available port).

## 4. Verify the Application

Open your web browser and navigate to the address provided by the `serve` command (e.g., `http://localhost:5000`).

Test adding, updating, and deleting todos. The data should now persist as it's being stored in the `db.json` file via the backend server.

## Important Notes

*   Both the backend and frontend servers must be running simultaneously for the application to function correctly.
*   If you are accessing the application from a different PC on the same network, you might need to replace `localhost` with the IP address of the machine running the backend server in `todolist-app/src/services/todoApi.ts`. You would then need to rebuild the frontend (`npm run build`) and serve it again.
*   Check your firewall settings if you encounter connection issues, as it might be blocking access to `localhost` or specific ports.
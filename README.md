# Billing Generator

A modern, web-based application designed to streamline the creation and management of professional invoices and receipts. This tool offers a variety of templates to suit different business needs and ensures that all calculations are handled accurately and automatically.

## ✨ Features

-   **Multiple Templates:** Choose from a diverse collection of 10 invoice and 4 receipt templates to match your brand's identity.
-   **Dynamic Calculations:** Automatically computes subtotals, taxes, and grand totals, minimizing errors and saving time.
-   **PDF Export:** Generate and download professional PDF versions of your invoices and receipts for easy sharing and record-keeping.
-   **Customizable Fields:** Easily input your company's details, client information, item descriptions, rates, and quantities.
-   **Responsive Design:** Access and manage your documents seamlessly across desktop and mobile devices.
-   **Robust Data Handling:** Ensures that all financial data is correctly parsed and displayed, preventing common errors like `NaN` values.

## 🚀 Getting Started

Follow these instructions to set up the project on your local machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) and a package manager like `npm` or `bun` installed.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Abhishek-ch30/billing-generator.git
    cd billing-generator
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    # or
    bun install
    ```

3.  **Run the development server:**
    ```sh
    npm run dev
    # or
    bun dev
    ```

The application will be available at `http://localhost:5173`.

## 🛠️ Summary of Work Done

This project was refined and debugged to enhance its functionality and user experience. Key contributions include:

-   **Comprehensive Debugging:** Identified and fixed critical data handling issues across all 10 invoice templates, resolving persistent `NaN` (Not a Number) errors.
-   **Data-Model Refactoring:** Updated all templates to use `item.rate` instead of `item.amount` for price calculations, ensuring consistency and accuracy.
-   **Robust Calculations:** Implemented reliable logic to automatically calculate subtotals, taxes, and grand totals, with proper fallbacks to prevent errors.
-   **UI/UX Enhancements:**
    -   Corrected layout issues, including removing an obstructive outer container to prevent text from being cut off.
    -   Improved the display of item names and descriptions with appropriate fallbacks for missing data.
-   **Version Control Setup:** Initialized a Git repository and prepared the project for versioning and collaboration on GitHub.

## 💻 Tech Stack

-   [React](https://reactjs.org/)
-   [Vite](https://vitejs.dev/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [Supabase](https://supabase.io/) (for potential backend integration)

## Project info

**URL**: https://run.gptengineer.app/projects/1340b42f-5412-43e0-b239-b5fdabd2feb7/improve

## How can I edit this code?

There are several ways of editing your application.

**Use GPT Engineer**

Simply visit the GPT Engineer project at [GPT Engineer](https://gptengineer.app/projects/1340b42f-5412-43e0-b239-b5fdabd2feb7/improve) and start prompting.

Changes made via gptengineer.app will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in the GPT Engineer UI.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

All GPT Engineer projects can be deployed directly via the GPT Engineer app.

Simply visit your project at [GPT Engineer](https://gptengineer.app/projects/1340b42f-5412-43e0-b239-b5fdabd2feb7/improve) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.gptengineer.app/tips-tricks/custom-domain/)

# Constituents App

This repository contains an application designed to collect contact information with basic CRUD (Create, Read, Update, Delete) operations.

## Features

- Collect and manage contact information.
- Perform CRUD operations on stored data.
- Simple and user-friendly interface.

## Prerequisites

- Node.js installed on your system.
- A database configured for use with Prisma.

## Setup Instructions

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/constituents.git
    cd constituents
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up the database:
    Run the Prisma setup script to initialize the database.
    ```bash
    npm run prisma:setup
    ```

4. Start the application:
    ```bash
    npm run dev
    ```
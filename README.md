# **Fragments Backend API**

A Node.js backend API for the **Fragments** project.  
This server is built with **Express**, **Pino** for structured logging, and includes automated linting, code formatting, and development tooling to ensure clean, consistent, and production-ready code.

---

## **Table of Contents**
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Setup & Installation](#2-setup--installation)
  - [3. Development](#3-development)
- [Logging](#logging)
- [Scripts](#scripts)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

---

## **Features**
- REST API powered by **Express**
- **Structured JSON Logging** with [Pino](https://getpino.io/)
- **Prettier** for automatic code formatting
- **ESLint** for linting and enforcing clean coding standards
- Cross-platform scripts for easy development with `cross-env` & `nodemon`

---

## **Project Structure**
fragments-backend/
├── src/
│ ├── app.js # Express app configuration and routes
│ ├── logger.js # Pino logger configuration
│ └── server.js # Entry point for starting the server
├── .vscode/ # VSCode workspace settings
├── .prettierrc # Prettier configuration
├── eslint.config.mjs # ESLint configuration
├── package.json
└── README.md


---

## **Getting Started**

### **1. Clone the Repository**
```bash
git clone https://github.com/YOUR_USERNAME/fragments.git
cd fragments

2. Setup & Installation
Initialize Project
npm init -y

Install Dependencies
# Core dependencies
npm install express cors helmet compression

# Logging
npm install pino pino-pretty pino-http

# Development tools
npm install --save-dev eslint prettier cross-env nodemon

Configure Prettier

Create a .prettierrc file:

{
  "arrowParens": "always",
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}


Create .prettierignore:

node_modules/
package.json
package-lock.json

3. Development
Run Linter
npm run lint

Start Server (Development Mode)
npm run dev

Debug Mode
npm run debug

Run Server (Production)
npm start

Logging

The project uses Pino for structured logging.

Default log level: info

Debug mode (LOG_LEVEL=debug) enables pretty-printed logs for easier local debugging.
Logger is configured in src/logger.js
.

Example log output:

{"level":30,"time":1692626400000,"msg":"Server started on port 8080"}

Scripts
Command	Description
npm run lint	Lint all .js files under src/
npm run dev	Start server in dev mode with nodemon
npm run debug	Start dev mode with debugging enabled
npm start	Start server in production mode
Technologies

Node.js & Express — Backend framework

Pino — Structured logging

Prettier — Automatic code formatting

ESLint — Enforces code quality

Helmet — Secures HTTP headers

Compression — Improves response speed

CORS — Cross-origin resource sharing


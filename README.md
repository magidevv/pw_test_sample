# Playwright Test Scripts for Redmine Website

## Summary of Repo

This repository contains automated test scripts for the **Redmine** website, developed using **Playwright**. The tests cover various functionalities, including **login, registration, and UI validations**. The project supports execution across multiple browsers (**Chromium, Firefox, and WebKit**) and integrates with **Allure reporting** for test result visualization.

## Requirements

Ensure your environment meets the following requirements:

- **Node.js** (>= 16.x recommended)
- **npm** or **yarn** for package management
- **Playwright** installed globally or within the project

  ```sh
  npm install @playwright/test --save-dev
  npx playwright install
  ```

- **Allure Commandline** for generating reports

  ```sh
  npm install -g allure-commandline --save-dev
  ```

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Install Playwright browsers:
   ```sh
   npx playwright install
   ```

## Launching Tests

You can execute tests using different Playwright configurations:

- Run all tests:
  ```sh
  npm run test:all
  ```
- Run tests in **headed mode** (with browser UI):
  ```sh
  npm run test:all:headed
  ```
- Run tests in a specific browser:
  ```sh
  npm run test:chromium
  npm run test:firefox
  npm run test:webkit
  ```
- Run a specific test suite:
  ```sh
  npm run test:login
  npm run test:registration
  ```

## Report Generation

This project integrates **Allure Reporting** to visualize test execution results.

- **Generate a report:**
  ```sh
  npm run test:allure
  ```
- **Serve the report on a local server:**
  ```sh
  npm run test:allure:open
  ```
- **Alternatively, serve on a fixed port (e.g., 4000):**
  ```sh
  npx http-server allure-report -p 4000
  ```

## CI/CD Integration

This project includes a GitHub Actions workflow to execute tests and publish reports to a separate `report` branch. Ensure environment variables are correctly set up in **GitHub Secrets** for smooth execution.

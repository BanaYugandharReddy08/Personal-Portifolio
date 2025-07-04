# React Portfolio

This project is a personal portfolio built with plain React using `react-scripts`. The application does not rely on Vite, Next.js or TypeScript. All components use the `.js` extension and standard CSS for styling.

## Available Scripts

- `npm start` – start the development server
- `npm run build` – build the production assets
- `npm test` – run tests and automatically generate a coverage report

Run `npm install` before executing any other scripts so that `react-scripts` and the other dev dependencies are available.

## Running Tests

Execute the following commands from the project root:

```sh
npm install
npm test
```

This installs all dependencies and then starts the Jest runner, generating a coverage report that can be viewed at `coverage/lcov-report/index.html`.

For CI environments a helper script is provided at `ci/setup.sh` which performs the `npm install` step before tests are executed.

The app entry point is `src/index.js` and routing is handled with `react-router-dom`.

## LeetCode Page

The `/leetcode` route lets you track algorithm problems you've solved. Each entry
is stored in `localStorage` so that your list persists between sessions. Clicking
a problem opens a modal where you can view the solution in either JavaScript or
Python using dedicated tabs.


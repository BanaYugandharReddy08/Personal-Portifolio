# React Portfolio

This project is a personal portfolio built with plain React using `react-scripts`. The application does not rely on Vite, Next.js or TypeScript. All components use the `.js` extension and standard CSS for styling.

## Available Scripts

- `npm start` – start the development server
- `npm run build` – build the production assets
- `npm test` – run tests and automatically generate a coverage report

Run `npm install` before executing any other scripts, especially prior to running `npm test`, to ensure all dependencies are available. The interactive Jest runner can be started with `npm test`, and a full coverage report will be generated automatically. It can be viewed at `coverage/lcov-report/index.html` after the command completes.

For CI environments a simple helper script is provided at `ci/setup.sh` which installs the dependencies before tests are executed.

The app entry point is `src/index.js` and routing is handled with `react-router-dom`.

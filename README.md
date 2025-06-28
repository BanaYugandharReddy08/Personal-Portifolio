# React Portfolio

This project is a personal portfolio built with plain React using `react-scripts`. The application does not rely on Vite, Next.js or TypeScript. All components use the `.js` extension and standard CSS for styling.

## Available Scripts

- `npm start` – start the development server
- `npm run build` – build the production assets
- `npm test` – run tests and automatically generate a coverage report

Run `npm install` before executing any other scripts, especially prior to running `npm test`, to ensure all dependencies are available. The interactive Jest runner can be started with `npm test`, and a full coverage report will be generated automatically. It can be viewed at `coverage/lcov-report/index.html` after the command completes.

For CI environments a simple helper script is provided at `ci/setup.sh` which installs the dependencies before tests are executed.

The app entry point is `src/index.js` and routing is handled with `react-router-dom`.

## Deploying to GitHub Pages

1. Ensure the `homepage` field in `package.json` points to your repository URL, for example:

   ```json
   "homepage": "https://<username>.github.io/<repo>"
   ```

2. Install the `gh-pages` package as a development dependency and add the following scripts:

   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```

3. Run `npm run deploy` after pushing changes to publish the contents of the `build/` folder to the `gh-pages` branch.

### Continuous deployment

Integrate your repository with GitHub Actions so that each push runs the test suite and deploys automatically. The helper script at `ci/setup.sh` installs dependencies in CI environments.

### Keeping dependencies secure

- Enable Dependabot (or a similar tool) to receive pull requests for outdated packages.
- Include `npm audit` in your CI workflow to detect vulnerable dependencies.

By combining automatic builds, tests and security checks you can maintain the portfolio with frequent updates while hosting it for free.

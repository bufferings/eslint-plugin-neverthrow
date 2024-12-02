import { rules } from './rules/index.js';

// note - cannot migrate this to an import statement because it will make TSC copy the package.json to the dist folder
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { name, version } = require('../package.json') as {
  name: string;
  version: string;
};

const plugin = {
  meta: { name, version },
  configs: {
    get recommended() {
      return recommended;
    },
  },
  rules,
};

const recommended = {
  plugins: {
    neverthrow: plugin,
  },
  rules,
};

export default plugin;

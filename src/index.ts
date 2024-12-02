import fs from 'fs';

import { rules } from './rules/index.js';

const { name, version } = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8')
) as {
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
  rules: {
    'neverthrow/must-use-result': 'error',
  },
};

export default plugin;

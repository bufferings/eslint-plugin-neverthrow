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
  configs: {},
  rules,
};

Object.assign(plugin.configs, {
  recommended: [
    {
      plugins: {
        neverthrow: plugin,
      },
      rules: {
        'neverthrow/must-use-result': 'error',
      },
    },
  ],
});

export default plugin;

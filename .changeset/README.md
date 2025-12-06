# Changesets

This project uses [changesets](https://github.com/changesets/changesets) to manage versioning and changelogs.

## Workflow

1. Make changes to the code.
2. Run `pnpm changeset` to create a changeset.
3. Commit the changeset along with your code.
4. Open a Pull Request.

When the PR is merged, a "Version Packages" PR will be created or updated. Merging that PR will release the new version to npm.

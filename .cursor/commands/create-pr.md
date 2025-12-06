# Create Pull Request

Create a Pull Request from the current branch to the main branch.

First, read `.cursor/rules/git-and-github.mdc` to understand the rules for this project.

## Prerequisites

- All changes must be committed

## Steps

1. **Fetch latest from origin**

   - Run `git fetch origin -p` to get the latest state and prune deleted branches

2. **Review commit history**

   - Run `git log origin/main..HEAD --oneline` to see commits not in main

3. **Decide on a descriptive branch name**

   - Based on the commits, decide a descriptive branch name
   - Example: `chore/migrate-to-changesets`, `feat/add-new-rule`, `fix/handle-edge-case`

4. **Push with the descriptive branch name**

   - Run `git push origin HEAD:<branch-name>` to push with the chosen name
   - Example: `git push origin HEAD:chore/migrate-to-changesets`

5. **Create PR title and body**

   - Based on the commits, create an appropriate PR title and body
   - Title should follow Conventional Commits format (e.g., `feat: add new feature`)

6. **Create PR**

   - Use `gh pr create` command to create the PR
   - **Important**: This repository has a fork structure, so always specify the `--repo` option
   - Use the pushed branch name for `--head`

## gh pr create Command Format

```bash
gh pr create --repo bufferings/eslint-plugin-neverthrow --base main --head <branch-name> --title "<title>" --body "<body>"
```

## Important Notes

- `--repo bufferings/eslint-plugin-neverthrow` is required (multiple remotes exist)
- `--base main` is the default branch
- `--head` should be the pushed branch name (e.g., `chore/migrate-to-changesets`)

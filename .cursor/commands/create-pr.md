# Create Pull Request

Create a Pull Request from the current branch to the main branch.

First, read `.cursor/rules/git-and-github.mdc` to understand the rules for this project.

## Prerequisites

- All changes must be committed
- The branch must be pushed to remote

## Steps

1. **Check current branch name**

   - Run `git branch --show-current` to get the current branch name

2. **Check for unpushed commits**

   - Run `git status` to check for differences with remote
   - If there are unpushed commits, ask whether to push first

3. **Review commit history**

   - Run `git log origin/main..HEAD --oneline` to see commits not in main

4. **Create PR title and body**

   - Based on the commits, create an appropriate PR title and body
   - Title should follow Conventional Commits format (e.g., `feat: add new feature`)

5. **Create PR**

   - Use `gh pr create` command to create the PR
   - **Important**: This repository has a fork structure, so always specify the `--repo` option

## gh pr create Command Format

```bash
gh pr create --repo bufferings/eslint-plugin-neverthrow --base main --head <branch-name> --title "<title>" --body "<body>"
```

## Important Notes

- `--repo bufferings/eslint-plugin-neverthrow` is required (multiple remotes exist)
- `--base main` is the default branch
- `--head` should be the current branch name

# Commit

Commit all unstaged changes.

First, read `.cursor/rules/git-and-github.mdc` to understand the rules for this project.

## Steps

1. **Check changes**
   - Run `git status` and `git diff` to review the changes
   - Always verify actual diffs with `git diff`, never rely on memory or assumptions

2. **Stage changes**
   - Run `git add .` to stage all changes

3. **Verify staged changes**
   - Run `git diff --cached` to verify what will be committed
   - Always run `git diff --cached` right before committing

4. **Create commit message**
   - Create a temporary file in `/tmp` directory with the commit message (following the format below)

5. **Execute commit**
   - Run `git commit -F <temp-file>` to commit using the temporary file

6. **Clean up**
   - Delete the temporary file after commit completes

## Commit Message Format

### Basic Format

```
<type>: <title in one line>

<description (max 5 lines)>
```

### Rules

- **Line 1**: Title line (50 characters or less recommended)
- **Line 2**: Blank line (required)
- **Line 3+**: Description (up to 5 lines)
- **Language**: Write in English

### Title Prefixes

| Prefix      | Purpose                                      |
| ----------- | -------------------------------------------- |
| `feat:`     | New feature                                  |
| `fix:`      | Bug fix                                      |
| `docs:`     | Documentation only changes                   |
| `style:`    | Formatting changes (no code behavior impact) |
| `refactor:` | Refactoring (no feature addition or bug fix) |
| `test:`     | Adding or modifying tests                    |
| `chore:`    | Build process or tool changes                |

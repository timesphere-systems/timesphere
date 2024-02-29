# Timesphere

## Git

### Code Review

When merging a branch, code should be reviewed by someone else (Egor/James?)

### Basics

Git is a **version control** system. It helps us keep track of changes, work in parallel, and review code. Git is an industry standard tool that almost everyone in the software engineering world uses. Github helps us manage our git repositories.

### Principals

- Do NOT commit large changes directly to master/main
- Make PRs, code review is good
- Keep PRs small, so they're easier to review
- Rebase before merging PRs

These ideas are based around making a clean history, and having good code review.
eg:

------------------------- main

\\\_\_\_/\\\_\_\_/\\\_\_\_/\\\_\_\_/\\\_\_\_/ branches with changes

### Guides

- [git branching](https://learngitbranching.js.org/)
- [git quickstart](https://docs.github.com/en/get-started/quickstart/set-up-git)

### Cheat Sheet

Commands you may forget but are extremely useful.

- `git checkout -b new-branch` > creates and checks out the branch "new-branch"
- `git checkout new-branch` > check existing branch "new-branch"
- `git rebase main` > rebase your current branch onto main
- `git pull` > fetch new updates from the git server

## Frontend

Source in `/front`

## Backend

Source in `/back`

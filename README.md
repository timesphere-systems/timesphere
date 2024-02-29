# Timesphere

## General

Really recommend you use a Linux/Mac machine or if on Windows set up [WSL](https://learn.microsoft.com/en-us/windows/wsl/install).
[VSCode](https://github.com/microsoft/vscode) is the recommended IDE.

Windows is by far the worst OS to develop on so WSL (windows subsystem for linux) is a good middle ground. Highly recommended to install and use.
Also highly recommend you use the Git **CLI**. The GUI gives less granular control and once you learn how to use the CLI properly you'll be much more efficient than possible on the GUI.

If you need help ask me (James).

## Frontend

Source in `/front`

## Backend

Source in `/back`

API surface written in Python using [FastAPI](https://fastapi.tiangolo.com/).

Do your best to follow standard Python [PEP8 convention](https://peps.python.org/pep-0008/) (but not to the detriment of maintainability).

## Dependencies

The system will have three components:

- React JS front-end
- Python back-end
- [PostgreSQL](https://www.postgresql.org/) database (mostly the same as MySQL)

## Running and Testing

Instructions to test and run the app will appear here after we have a basis for the program. We'll be using docker containers and a docker-compose system.
Useful info:

- [What is a docker container](https://docs.docker.com/guides/walkthroughs/what-is-a-container/)
- [What is docker-compose](https://docs.docker.com/compose/)
- [Python virtual environments](https://docs.python.org/3/library/venv.html)

## Integration and Deployments

Mainly the responsibility of James, but for those interested:
We'll host all components on the DigitalOcean cloud as this is easy and students get a free $200 credit.

We can use their [app platform](https://docs.digitalocean.com/products/app-platform/) offering to automatically deploy our prototype to the cloud.

Github actions will be used to run integrated tests/checks.
**TBC**

## Git

### Basics

Git is a **version control** system. It helps us keep track of changes, work in parallel, and review code. Git is an industry standard tool that almost everyone in the software engineering world uses. Github helps us manage our git repositories.

- First pull the repository
  - SSH key (easiest method of authentication)
    - On Linux/Mac this is very simple, on [windows](https://github.com/git-guides/install-git) it may require a little more [finess](https://stackoverflow.com/questions/51023197/how-to-configure-git-with-ssh-keys-on-windows-10).
    - [Generate](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) an ssh key.
    - Add to [GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).
  - Personal access token
    - More fiddly (not recommended).
    - Might be already done for you with the windows Git implementation.
    - [Generate](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) a token.
    - Sign in with the token as your password.

### Code Review

When merging a branch, code should be reviewed by someone else (Egor/James?)

### Principals

- Do NOT commit large changes directly to master/main
- Make PRs, code review is good
- Keep PRs small, so they're easier to review
- **Rebase** before merging PRs

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

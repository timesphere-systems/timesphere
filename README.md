# Timesphere

## Running and Testing

Useful info:

- [What is a docker container](https://docs.docker.com/guides/walkthroughs/what-is-a-container/)
- [What is docker-compose](https://docs.docker.com/compose/)
- [Python virtual environments](https://docs.python.org/3/library/venv.html)

Our `docker-compose.yml` file starts four containers:

- PostgreSQL database
- Backend API
- Frontend React app
- Nginx reverse proxy

To run the app, you need to have [Docker](https://docs.docker.com/get-docker/) and have it running on your main system (Windows if using WSL). Then, in a terminal, in the root of the project run:

`cp example.env .env`

The .env file will store environment variables for the project. You can change your .env as necessary but leave the example such that it can be copied and the app will work by default.

`./build.sh`

This will build the containers in `/back` and `/front`.

Authentication is the most difficult part to set up for testing. We utilize the following scopes:

- `timesphere:admin` - Admin access to all resources

To set this up, you'll need to create an auth0 acount and either set up an application or ask to be added to an existing one.

To set up an application:

- Create an application
- Select Web > Python
- Continue
- In Settings > Advanced > Grant Types enable implicit and client credentials
- Add the domain, client ID, audience, and client secret to the .env file
- Go to the connected API > Permissions > Create Permission and create the scopes above
- Go to users > select your user, or create one > permissions > add the scopes
- In Actions > Flows > Login create a custom action with the code in `./.auth0/postlogin.js`

To test with auth (generate a JWT):

- Go to the auth0 dashboard
- Go to extensions
- Install the Auth0 Authentication API Debugger
- Go to the debugger
- Configure it for the application you created earlier, add its URL as an authorized callback
- In the OAuth2/OIDC tab, scroll down and add scopes, select Oauth2/OIDC login and login as such
- Retrieve JWT, click authorize in the fastAPI docs, and paste the JWT in the token field

`docker-compose up`

This starts the container stack, and by default you should be able to access the app at [localhost](http://localhost). Press Ctrl+C to stop the containers, and `docker-compose down` to remove them.

If you need to reset the database, run `docker-compose down` and then `docker volume rm timesphere_postgres-data`. This will remove the database and all data.

## General

Really recommend you use a Linux/Mac machine or if on Windows set up [WSL](https://learn.microsoft.com/en-us/windows/wsl/install).
[VSCode](https://github.com/microsoft/vscode) is the recommended IDE.

Windows is by far the worst OS to develop on so WSL (windows subsystem for linux) is a good middle ground. Highly recommended to install and use.
Also highly recommend you use the Git **CLI**. The GUI gives less granular control and once you learn how to use the CLI properly you'll be much more efficient than possible on the GUI.

If you need help ask me (James).

## Frontend

Source in `/front`

To install all necessary dependencies run `npm install`

To run the app, make sure you are in the `/front` directory, then run the `npm run start` command.

If you want to run the app with Auth and Backend, you must run it using Docker.

In VSCode, to make it easier to work with Docker you can do `command+shift+P`, then search `Run Task` and then run the Docker tasks from there. The `Build and Restart` task makes it easier to rebuild Docker if you just made changes to your code while working.

## Backend

Source in `/back`

To run the backend, follow the instructions in `/back/README.md`

API surface written in Python using [FastAPI](https://fastapi.tiangolo.com/).

Do your best to follow standard Python [PEP8 convention](https://peps.python.org/pep-0008/) (but not to the detriment of maintainability).

## Dependencies

The system will have three components:

- React JS front-end
- Python back-end
- [PostgreSQL](https://www.postgresql.org/) database (mostly the same as MySQL)

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
  - Sort out your authentication
    - SSH key (easiest method of authentication)
      - On Linux/Mac this is very simple, on [windows](https://github.com/git-guides/install-git) it may require a little more [finess](https://stackoverflow.com/questions/51023197/how-to-configure-git-with-ssh-keys-on-windows-10).
      - [Generate](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) an ssh key.
      - Add to [GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).
    - Personal access token
      - More fiddly (not recommended).
      - Might be already done for you with the windows Git implementation.
      - [Generate](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) a token.
      - Sign in with the token as your password.
  - `git clone git@github.com:the-Jamz/timesphere.git` if authenticating with SSH or `git clone https://github.com/the-Jamz/timesphere.git` otherwise.
  - Later on to get changes from the repository simply `git pull`
- Branch off to make changes
- Make reasonably sized commits with helpful messages
- Push the branch when done
- Make a pull request to merge the changes into `main`

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

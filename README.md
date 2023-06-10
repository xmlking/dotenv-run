<h1>@dotenv-run/cli</h1>


Another CLI tool to load environment variables defined in `.env` files with monorepo support.

* ✅ Load environment variables from `.env` files
* ✅ Expand environment variables using dotenv-expand
* ✅ Load priorities of environment variables defined in `.env.*` files
* ✅ Define environment variables for a specific mode using `NODE_ENV` (e.g. `.env.production`)
* ✅ Supports hierarchical cascading configuration in monorepo projects ([Nx](https://nx.dev), [Turbo](https://turbo.build/), etc.)
* ✅ Universal support for all programming languages and frameworks
  

# Quick Start

## Installation
```sh
npm add -D @dotenv-run/cli
```

## Prompt
```sh
$> dotenv-run -h

Usage: dotenv-run [options] -- <command>

Options:

    -h, --help     output usage information
    -p, --print    print the paths that will be loaded
    -r, --root     root directory to search for .env files, defaults to current working directory

Examples:

    dotenv-run -- npm start
    dotenv-run -p -r ../.. -- npm run build
```

## Usage

Beside loading environment variables, **@dotenv-run/cli** supports monorepo projects with multiple applications.

When you have multiple applications in your monorepo, you can define common `.env.*` files in the root of your workspace and override the environment variables on each application or any other subdirectory below the root.

Let's say you have the following workspace:

```sh
/workspace
 apps
    frontend1
       .env.local # API_USERS=http://localhost:3001/users
       src/
    frontend2
       src/
.env.dev # API_BASE=https://dotenv-run.dev
.env.prod # API_BASE=https://dotenv-run.app
.env # API_USERS=$API_BASE/api/v1/users API_AUTH=https://$API_BASE/auth
```

```sh
$> cd /workspace
$> NODE_ENV=prod dotenv-run -p -- bash -c 'echo "✨ $API_USERS"'
✔ /workspace/.env.prod
✔ /workspace/.env
✨ https://dotenv-run.app/api/v1/users
```

```sh
$> cd /workspace/apps/frontend1
$> dotenv-run -p -- bash -c 'echo "✨ $API_USERS"'
✔ /workspace/apps/frontend1/.env.local
✨ http://localhost:3001/users
```

```sh
$> cd /workspace/apps/frontend1
$> NODE_ENV=dev dotenv-run -p -r ../.. -- bash -c 'printf "✨ API_USERS $API_USERS\n✨ API_AUTH $API_AUTH"'
✔ /workspace/apps/frontend1/.env.local
✔ /workspace/.env.dev
✔ /workspace/.env
✨ API_USERS http://localhost:3001/users
✨ API_AUTH https://dotenv-run.dev/api/v1/auth
```

```sh
$> cd /workspace/apps/frontend2
$> API_BASE=$CI_CONTAINER_API dotenv-run -r ../.. -p -- bash -c 'echo "✨ $API_USERS"'
✔ /workspace/.env
✨ https://XAE221D1DE-ci-provider.cloud/api/v1/users

# CI_CONTAINER_API could be an environment variable provided by some CI provider 
```

Paths to the root workspace can be relative or absolute,  the following are all valid :
* ` "root": "../.."`
* ` "root": "../...env"`
* ` "root": "/workspace"`
* ` "root": "/workspace/.env"`


## Loading Priorities

`@dotenv-run/cli` uses [dotenv](https://github.com/motdotla/dotenv) to support loading environment variables from `.env` files.

`@dotenv-run/cli` loads `.env` files with these specific names for the following `NODE_ENV` values, files on the top have less priority than files on the bottom.

An env file for a specific mode (e.g. .env.production) will take higher priority than a generic one (e.g. .env).

| valid `.env` filenames     | `NODE_ENV=*` | `NODE_ENV=test` |
| -------------------------- | -------------- | ----------------- |
| `.env`                     | ✔️             | ✔️                |
| `.env.local`               | ✔️             | ✖️                |
| `.env.${NODE_ENV}`       | ✔️             | ✔️                |
| `.env.${NODE_ENV}.local` | ✔️             | ✔️                |

In addition, environment variables that already exist when the CLI is executed have the highest priority and will not be overwritten by .env files. For example, when running `SOME_KEY=123 dotenv-run`.

## Expanding `.env`

You can expand variables already available on your machine for use in your `.env`

For example:

```shell
VERSION=$npm_package_version
HOSTNAME=$HOSTNAME
```

Or expand variables local to the current `.env` file:

```shell
DOMAIN=www.example.com
FOO=$DOMAIN/foo
BAR=$DOMAIN/bar
```


## Command Line

Defining environment variables can vary between OSes. It’s also important to know that this manner is temporary for the life of the shell session.

### Windows (cmd.exe)

```cmd
set "API_URL=abcdef" && npm start
```

(Note: Quotes around the variable assignment are required to avoid a trailing whitespace.)

### Windows (Powershell)

```Powershell
($env:API_URL = "abcdef") -and (npm start)
```

### Linux, macOS (Bash)

```sh
API_URL=abcdef npm start
```

# In the browser

In order to consume environment variables in your webapps, you need to expose them to the browser. The bundler you use will need to support replacing the environment variables at build time.

**React, Vue.js...**

Use [Vite](https://vitejs.dev/guide/env-and-mode.html)

**Angular**

Use [@ngx-env/builder](https://www.npmjs.com/package/@ngx-env/builder)

# License

MIT © [Chihab Otmani](https://twitter.com/chihabotmani)



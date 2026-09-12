### AI Usage Disclosure

Parts of this project (backend and frontend code, tests, and this
documentation) were generated and refined with assistance from **Claude
Sonnet 5** (Anthropic), used as a coding assistant throughout development,
per Umanni's AI Policy in the test instructions.

# Umanni User Management App

A Rails 8 + Inertia.js/React application for managing users with role-based
access, a real-time admin dashboard, and async spreadsheet import.

## Stack

- Ruby 3.4.10, Rails ~> 8.1 (the README asked for Ruby 4.0+, which has not
  been released as a stable version; 3.4.10 is the latest stable 3.x).
- PostgreSQL
- Inertia.js + React (Vite), Tailwind CSS
- Solid Queue / Solid Cable (no Redis)
- RSpec, FactoryBot, Capybara + Selenium, SimpleCov (90% minimum coverage)

## Setup

```bash
bundle install
bin/rails db:create db:migrate db:seed
bin/dev # boots Rails + Vite
```

Once running, visit `/register` to create an account, or `/session/new`
(also the root path) to log in with a seeded account below. A logged-in
admin lands on the dashboard (`/dashboard`), with real-time counts and a
`/users` CRUD screen; a logged-in regular user lands on their profile
(`/profile`), which can be edited at `/profile/edit` (full name and avatar)
or deleted from there. Avatar upload is file-only (no remote-URL input, per
the design spec) and validated server-side (`ActiveStorage`,
content-type/size) — see
`docs/superpowers/specs/2026-09-11-user-management-app-design.md` for
details.

From `/users`, an admin can also bulk-import users at `/imports/new` by
uploading a `.csv` or `.xlsx` spreadsheet (parsed with the `roo` gem). Rows
are created asynchronously via Solid Queue, with live progress (processed
count, status, and any per-row errors) streamed back over Solid Cable to the
import page; invalid rows are skipped and reported rather than aborting the
whole import.

Default seeded accounts (see `db/seeds.rb`):
- Admin: `admin@umanni.test` / `password123`
- Users: `user1@umanni.test` .. `user3@umanni.test` / `password123`

## Running tests

```bash
bin/rspec
```

## Docker

```bash
docker compose up
```

(Docker/Kamal details are finalized in a later stage of this project.)

## Local development notes (this sandbox)

This sandbox has no root/sudo, so Postgres, the Ruby native-extension
toolchain, and headless Chrome are **not** installed via `apt`/system
services. None of this applies on a normal machine with `apt install
build-essential libpq-dev` and Chrome/Chromium available (or a CI image like
GitHub Actions' `ubuntu-latest`, which ships Chrome).

### Postgres and the Ruby/gcc toolchain

- **Postgres** runs as a Docker container instead of a system service:
  ```bash
  docker run -d --name umanni-postgres -e POSTGRES_PASSWORD=postgres \
    -p 5432:5432 -v umanni-pgdata:/var/lib/postgresql/data postgres:16
  ```
  On a machine where the container already exists, just `docker start
  umanni-postgres`. It must be running before `bin/rails db:create`,
  `bin/rails db:migrate`, or the test suite will work — `config/database.yml`
  expects it on `localhost:5432` with user/password `postgres`/`postgres`
  (overridable via `DB_HOST`/`DB_USERNAME`/`DB_PASSWORD`).
- **Ruby/gcc**: installed via [mise](https://mise.jdx.dev) (`mise use -g
  ruby@3.4.10 node@22`). Since no `apt install build-essential` was possible
  either, native gems (e.g. `websocket-driver`, `nio4r`) compile against a
  user-space C toolchain assembled by `apt-get download`-ing `gcc-14`/`make`/
  `libpq-dev` `.deb`s and extracting them (`dpkg-deb -x`, no root needed) into
  `~/.local/toolchain`; `~/.local/toolchain/env.sh` puts that on `PATH` and
  sets `LD_LIBRARY_PATH`.

### Headless Chrome

For `spec/system/*`, driven by Capybara/Selenium: no `google-chrome`/
`chromium` package is installable without `apt`, so Chrome for Testing was
fetched as a portable build via `npx puppeteer browsers install chrome`
(extracted manually with Python's `zipfile` into
`~/.cache/puppeteer/chrome/<version>/chrome-linux64/` since `unzip` isn't
available either), its missing shared libs (`libnspr4`, `libnss3`,
`libasound2t64`, and friends — not on the base image) were pulled as
`noble` `.deb`s from `archive.ubuntu.com` and extracted with `dpkg-deb -x`
into `~/.local/chrome-libs`, and `chmod +x` was applied to
`chrome_crashpad_handler` inside the extracted build (its executable bit
doesn't survive the zip). To run system specs in this sandbox:

```bash
export LD_LIBRARY_PATH="$HOME/.local/chrome-libs"
export PATH="$HOME/.cache/puppeteer/chrome/<version>/chrome-linux64:$PATH"
bin/rspec spec/system
```

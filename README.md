# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

## Local development (this sandbox)

This sandbox has no root/sudo, so Postgres and the Ruby native-extension
toolchain are **not** installed via `apt`/system services:

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
  sets `LD_LIBRARY_PATH`. A normal machine with `build-essential` and
  `libpq-dev` installed via `apt` needs none of this.

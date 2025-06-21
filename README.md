<div align="center">
  <img src="./frontend/app/favicon.ico" width="100">
  <h1>
      Semaphore
  </h1>
  <h4>The simplest, no nonsense AI chat app!</h4>
</div>

<img src="./frontend/public/landing.png">

## Local Install

- Execute these commands. (assuming you have `docker` and `docker-compose` installed on your system, if not, install them first.)

```sh
git clone https://github.com/codingCoffee/semaphore

cd semaphore

docker compose up -d

# wait for a min
docker compose exec frontend npm run db:migrate
```

- Visit [http://localhost:3000](http://localhost:3000)

## Developers

semaphore is free and open source software licensed under Apache-2.0 license. If you are interested in contributing, feel free to open up a PR.

- The app is in NextJS with Typescipt support, tailwind for CSS and shadcn is used for the component library
- Postgres is used for the database
- Zero by Replicache is used for the sync engine, and to achieve resumable streams :)

## License

semaphore is licensed under the Apache-2.0 License

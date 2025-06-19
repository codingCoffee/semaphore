<div align="center">
  <img src="./frontend/app/favicon.ico" width="100">
  <h1>
      Semaphore
  </h1>
  <h4>The simplest, no nonsense AI chat app!</h4>
</div>


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


<div align="center">
  <a href="https://semaphore.chat" target="_blank" rel="noopener noreferrer">
    <img src="./frontend/app/favicon.ico" width="100">
  </a>

  <a href="https://semaphore.chat" target="_blank" rel="noopener noreferrer">
    <h1>Semaphore</h1>
  </a>

  <h4>The simplest, no nonsense AI chat app!</h4>
</div>

<a href="https://semaphore.chat" target="_blank" rel="noopener noreferrer">
  <img src="./frontend/public/landing.png">
</a>

## Demo

[semaphore.chat](https://semaphore.chat)

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

## Notable Features

<details>
<summary>- 💬 Chat with Various LLMs</summary>
Engage with multiple large language models in one seamless interface.
</details>

<details>
<summary>- 🔒 Authentication & Sync</summary>
Secure your conversations and sync chats across devices.
</details>

<details>
<summary>- 🌐 Browser Friendly</summary>
Works smoothly in all modern web browsers—no installation required.
</details>

<details>
<summary>- 🔍 Web Search (Beta)</summary>
Fetch information from the web right within your chat (experimental feature).
</details>

<details>
<summary>- ⏯️ Resumable Streams</summary>
Resume, or replay chat streams for uninterrupted workflows.
</details>

<details>
<summary>- 📊 MermaidJS Diagram Renders</summary>
Visualize diagrams and flowcharts with MermaidJS integration.
</details>

<details>
<summary>- 💡 Code Syntax Highlighting</summary>
Enjoy beautifully highlighted code snippets for better readability.
</details>

<details>
<summary>- 🌙 Dark Mode</summary>
Switch between light and dark themes for comfortable browsing.
</details>

<details>
<summary>- 🔑 Bring Your Own Keys</summary>
Use your own API keys for enhanced privacy and customization.
</details>

<details>
<summary>- 📱 Mobile Friendly</summary>
Fully responsive design for a great experience on smartphones and tablets.
</details>

## Contributing

semaphore is free and open source software licensed under Apache-2.0 license. If you are interested in contributing, feel free to open up a PR.

- The app is in NextJS with Typescipt support, tailwind for CSS and shadcn is used for the component library
- Postgres is used for the database
- Zero by Replicache is used for the sync engine, and to achieve resumable streams :)

## Authors

- [@codingcoffee](https://github.com/codingcoffee)

## License

semaphore is licensed under the Apache-2.0 License

<div align="center">

# [Semaphore](https://semaphore.chat)

  <h4>The simplest, no nonsense AI chat app!</h4>
</div>

<a href="https://semaphore.chat" target="_blank" rel="noopener noreferrer">
  <img src="https://github.com/user-attachments/assets/fb02bd20-d269-429e-a94e-690e6c6b084f">
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
<p>Engage with multiple large language models in one seamless interface.</p>
<img src="https://github.com/user-attachments/assets/1fb0ef01-cdbe-41c1-b3c7-42dbb4d57419">
</details>

<details>
<summary>- 🔒 Authentication & Sync</summary>
<p>Secure your conversations and sync chats across devices with Google Login</p>
<img src="https://github.com/user-attachments/assets/891a74f4-f577-4f1f-a308-595959aa8c39">
</details>

<details>
<summary>- 🌐 Browser Friendly</summary>
<p>Works smoothly in all modern web browsers—no installation required.</p>
</details>

<details>
<summary>- 🔍 Web Search (Beta)</summary>
<p>Fetch information from the web right within your chat (experimental feature).</p>
<img src="https://github.com/user-attachments/assets/615add68-c220-43d7-8e75-d2152018522e">
</details>

<details>
<summary>- ⏯️ Resumable Streams</summary>
<p>Resume, or replay chat streams for uninterrupted workflows.</p>

https://github.com/user-attachments/assets/8a919c00-c2ed-4c12-bf77-29505bfbe9e1

</details>

<details>
<summary>- 📊 MermaidJS Diagram Renders</summary>
<p>Visualize diagrams and flowcharts with MermaidJS integration.</p>
<img src="https://github.com/user-attachments/assets/765e4e1c-1418-43bc-9bb4-c4380bdf3903">
</details>

<details>
<summary>- 💡 Code Syntax Highlighting</summary>
<p>Enjoy beautifully highlighted code snippets for better readability.</p>
<img src="https://github.com/user-attachments/assets/c13f89f8-0f63-4d54-a45f-57563fa31fcb">
</details>

<details>
<summary>- 🌙 Dark Mode</summary>
<p>Switch between light and dark themes for comfortable browsing.</p>
<img src="https://github.com/user-attachments/assets/aba0d1eb-e95c-48c4-91a9-27d7493b758a">
</details>

<details>
<summary>- 🔑 Bring Your Own Keys</summary>
<p>Use your own API keys for enhanced privacy and customization.</p>
<img src="https://github.com/user-attachments/assets/a0c669a6-3777-4416-a288-aa45d75795cb">
</details>

<details>
<summary>- 📱 Mobile Friendly</summary>
<p>Fully responsive design for a great experience on smartphones and tablets.</p>
<img src="https://github.com/user-attachments/assets/434a3f8c-3dcb-4970-ad4a-8135afd356eb">
</details>

## Architecture

```mermaid
graph TD

    %% Frontend
    A[Next.js Client] -->|HTTP /chat API| B[Next.js Server]

    %% Next.js Server to Zero-Client
    A -->|ZQL| C[Zero-Client]

    %% Zero-Cache and Postgres
    C <-->|"sync (WebSocket)"| D[Zero-Cache]
    D -->|"write to db (SQL)"| E[PostgreSQL Database]
    E -->|"logical replication"| D

    %% OpenRouter
    B --> F[OpenRouter]
    F --> B

    %% Write
    B --> E
```

## Prod Deployment

```
npm run db:migrate
```

## Contributing

semaphore is free and open source software licensed under Apache-2.0 license. If you are interested in contributing, feel free to open up a PR.

- The app is in NextJS with Typescipt support, tailwind for CSS and shadcn is used for the component library
- Postgres is used for the database
- Zero by Replicache is used for the sync engine, and to achieve resumable streams :)

## Authors

- [@codingcoffee](https://github.com/codingcoffee)

## License

semaphore is licensed under the Apache-2.0 License

async function main() {
  console.log("hi");
  const message =
    "write a sample javascript function to replace 'hello' with randomness in a long piece of text which is nicely given by a little child";

  const content = `Generate a concise, descriptive title (max 10 words) for the user query below to an LLM, summarizing its main topic and intent.

${message}
`;
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://codingcoffee.dev",
      "X-Title": "Semaphore Chat",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: content }],
      stream: false,
    }),
  });

  const data = await resp.json();
  console.log(data.choices[0].message.content);
}

main();

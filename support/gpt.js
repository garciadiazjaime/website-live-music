const fetch = require("node-fetch");

const events = require("../public/events.json");

const TOP_EVENTS_LIMIT = 2;

async function main() {
  console.log("starting...");

  const titles = events.map((item) => item.name).slice(0, TOP_EVENTS_LIMIT);
  const prompt = `Write the text for an ad inviting people from chicago to the following events, make it fun and snappy. Aim for 30 seconds: \n${titles.join(
    "\n"
  )}`;
  console.log(prompt);

  if (!process.env.OPEN_AI_API_KEY) {
    console.log("GTP Token not defined");
    return;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "post",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 100,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
    },
  });

  const { data } = await response.json();
  const gptResponse = data.choices[0].message.content;

  const videoScript = `Create a video using exactly this script:\n

  ${gptResponse}\n

  Make the background music exciting and fast paced\n

  Settings: Use a female voice with a midwestern accent.`;
  console.log(videoScript);
}

main().then(() => console.log("END"));

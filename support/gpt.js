const events = require('../public/events.json');
const axios = require('axios');

async function gptRequest() {
  const titles = events.map(item => item.title).slice(0,2);
  const prompt = `Write the text for an add inviting people from chicago to the following events, make it fun and snappy. Aim for 30 seconds: ${titles.join(', ')}`
  console.log(prompt)

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      "model": "gpt-3.5-turbo",
      "messages": [{"role": "user", "content": prompt}],
      "temperature": 0.7,
      "max_tokens": 100,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
    }
  );
  // Handle the API response here
  const { data } = response;
  const videoScript = `Create a video using exactly this script\n

  ${data.choices[0].message.content}\n

  Make the background music exciting and fast paced\n

  Settings: Use a female voice with a midwestern accent.`
  console.log(videoScript);
}
gptRequest().then(() => console.log('END'));

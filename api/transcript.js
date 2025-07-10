export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { audio_url } = req.body;

  if (!audio_url) {
    return res.status(400).json({ error: 'audio_url missing' });
  }

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer YOUR_OPENAI_API_KEY`,
    },
    body: JSON.stringify({
      model: "whisper-1",
      file: audio_url,
      response_format: "text",
      language: "tr"
    })
  });

  const transcript = await response.text();
  res.status(200).json({ transcript });
}

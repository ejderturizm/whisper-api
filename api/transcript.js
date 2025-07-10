// /api/transcript.js
import { Readable } from "stream";
import fetch from "node-fetch";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const bodyString = Buffer.concat(buffers).toString();
  const body = JSON.parse(bodyString);

  const { audio_url, openai_api_key } = body;

  const audioRes = await fetch(audio_url);
  const audioBuffer = await audioRes.buffer();

  const formData = new FormData();
  formData.append("file", new Blob([audioBuffer]), "audio.mp3");
  formData.append("model", "whisper-1");

  const whisperRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openai_api_key}`,
    },
    body: formData,
  });

  const result = await whisperRes.json();
  return res.status(200).json({ success: true, transcript: result.text });
}

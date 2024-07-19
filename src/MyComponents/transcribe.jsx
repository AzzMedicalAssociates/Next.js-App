const fs = require("fs");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

async function main() {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(
      "C:UsersSoha.sarwarDownloadsVN816435 Popoca, Alicia.mp3"
    ),
    model: "whisper-1",
    language: "de", // this is optional but helps the model
  });

  console.log(transcription);
}
main();

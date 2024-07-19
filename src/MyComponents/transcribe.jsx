const fs = require("fs");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "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",
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

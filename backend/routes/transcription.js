// routes/transcription.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

const ASSEMBLY_API_KEY =process.env.API_KEY;

router.post("/transcribe", async (req, res) => {
  try {
    const { audioUrl } = req.body;

    // Upload audio file from external URL
    const uploadRes = await axios({
      method: "post",
      url: "https://api.assemblyai.com/v2/upload",
      headers: {
        authorization: ASSEMBLY_API_KEY,
      },
      data: await axios({ url: audioUrl, responseType: "stream" }).then(r => r.data),
    });

    const { upload_url } = uploadRes.data;

    // Request transcription
    const transcriptRes = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      { audio_url: upload_url },
      { headers: { authorization: ASSEMBLY_API_KEY } }
    );

    const transcriptId = transcriptRes.data.id;

    // Poll until complete
    const poll = async () => {
      const pollRes = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        { headers: { authorization: ASSEMBLY_API_KEY } }
      );

      if (pollRes.data.status === "completed") {
        return pollRes.data;
      } else if (pollRes.data.status === "error") {
        throw new Error(pollRes.data.error);
      } else {
        await new Promise(res => setTimeout(res, 3000));
        return poll();
      }
    };

    const transcriptData = await poll();
    // transcriptData.words is an array of {text, start, end}
    res.json({ transcript: transcriptData.text, words: transcriptData.words });

  } catch (err) {
    console.error("Transcription error:", err.message);
    res.status(500).json({ message: "Failed to transcribe audio" });
  }
});

module.exports = router;

import express from "express";
import cors from "cors";
import multer from "multer";
import OpenAI from "openai";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "/tmp" });

const openai = new OpenAI({
  apiKey: "286568417935"
});

app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const imgPath = req.file.path;
    const imgData = fs.readFileSync(imgPath);

    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type:"input_text", text:"Analyze this image" },
            { type:"input_image", image: imgData.toString("base64") }
          ]
        }
      ]
    });

    fs.unlinkSync(imgPath);
    res.json({ success:true, result: result.choices[0].message });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.get("/", (req,res)=>res.send("Backend running."));

app.listen(10000, ()=>console.log("Server running on port 10000"));

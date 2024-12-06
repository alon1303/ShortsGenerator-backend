import express, { Request, Response, Application } from "express"; // Import types
import http from "http";
import chokidar from "chokidar";
import path from "path";
import { getSubtitles } from "./ApiService";
import { Subtitle } from "./interfaces/interfaces";
import multer from "multer";
import cors from "cors";
import { renderVideo } from "./render";
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const videoFolderPath = path.join(
  "C:\\Users\\alon8\\Desktop\\http-web-server\\assets"
);

function watchFolder() {
  chokidar
    .watch(videoFolderPath, { ignoreInitial: true })
    .on("add", async (filePath: string) => {
      const fileName: string = path.basename(filePath);
      console.log("New video added:", fileName);

      const subtitles: Subtitle[] | undefined = await getSubtitles(filePath);
      if (typeof subtitles !== undefined) {
        console.log("succesfully got subtitles");

        io.emit("newVideo", fileName, subtitles);
      }
    });
}

// watchFolder();

const uploadPath = "C:\\Users\\alon8\\Desktop\\http-web-server\\assets";
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "video/mp4",
      "video/avi",
      "video/mkv",
      "video/mov",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"));
    }
  },
}).single("file");

app.post("/upload/video", uploadVideo);
function uploadVideo(req: Request, res: Response) {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).send(false);
    }

    // File successfully saved
    const filePath: string = path.join(uploadPath, req.file.filename);
    console.log(`File saved: ${filePath}`);
    const fileName: string = req.file.filename;

    const subtitles: Subtitle[] | undefined = await getSubtitles(filePath);
    if (subtitles !== undefined) {
      console.log("succesfully got subtitles");
      const videoHttpPath = `http://localhost:8080/assets/${req.file.filename}`;
      const renderResult = renderVideo(videoHttpPath, subtitles);
      res.status(200).send(renderResult);
    }
  });
}

app.get("/", helloWorld);
function helloWorld(req: Request, res: Response) {
  res.send({ hello: "world" });
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

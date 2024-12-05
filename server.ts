import express, { Request, Response, Application } from "express"; // Import types
import http from "http";
import chokidar from "chokidar";
import path from "path";
import { getSubtitles } from "./ApiService";
import { Subtitle } from "./interfaces/interfaces";
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const videoFolderPath = path.join(
  "C:\\Users\\alon8\\Desktop\\http-web-server\\assets"
);

function watchFolder() {
  chokidar.watch(videoFolderPath).on("add", async (filePath: string) => {
    const fileName: string = path.basename(filePath);
    console.log("New video added:", fileName);

    const subtitles: Subtitle[] | undefined = await getSubtitles(filePath);
    if (typeof subtitles !== undefined) {
      console.log("succesfully got subtitles");
      
      io.emit("newVideo", fileName, subtitles);
    }
  });
}

watchFolder();
app.post('/upload-video')

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

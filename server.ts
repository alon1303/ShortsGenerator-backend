const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const chokidar = require("chokidar");
const path = require("path");
import { watch } from "chokidar";
import { getSubtitles } from "./ApiService";
import { Subtitle } from "./interfaces/interfaces";
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

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
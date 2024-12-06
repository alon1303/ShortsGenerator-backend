// src/render.ts
import { renderMedia, selectComposition } from "@remotion/renderer";

import path from "path";
import { Subtitle } from "./interfaces/interfaces";
import { bundle } from "@remotion/bundler";
type Props = {
	videoUrlFromServer: string;
	subtitlesFromServer: Subtitle[];
};
export async function renderVideo(videoURL: string, subtitles: Subtitle[]) {
  try {
    const compositionId = "MyComp";
    const bundleLocation = "C:\\Users\\alon8\\Desktop\\ShortsGenerator\\build"
    const inputProps:Props = {
      videoUrlFromServer: videoURL,
      subtitlesFromServer: subtitles,
    };
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps,
    });
    console.log(composition);
    const renderResult = await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: `C:\\Users\\alon8\\Desktop\\http-web-server\\output_render\\${Date.now()}_${compositionId}.mp4`,
      inputProps,
    });
    
    return renderResult;
  } catch (error) {
    console.error("Error during rendering:", error);
  }
}

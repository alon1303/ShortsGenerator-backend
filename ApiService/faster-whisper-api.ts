import axios from "axios";
import { Subtitle } from "../interfaces/interfaces";
const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});
function secondsToFrames(seconds: number) {
  const frameRate = 30;

  return Math.round(seconds * frameRate);
}

function updateSubtitles(subtitles: Subtitle[]): Subtitle[] {
  const updatedSubtitles: Subtitle[] = subtitles.map((subtitle) => ({
    ...subtitle,
    startFrame: secondsToFrames(subtitle.startTime),
    endFrame: secondsToFrames(subtitle.endTime),
  }));
  return updatedSubtitles;
}
export async function getSubtitles(
  filePath: string
): Promise<Subtitle[] | undefined> {
  try {
    const response = await apiClient.put<Subtitle[]>("/video/subtitles", null, {
      params: { file_path: filePath },
    });
    if(!response.data){
      console.error("Subtitles Error!: got undefined");  
    }
    const subtitles = updateSubtitles(response.data)
    
    return subtitles;
  } catch (e: any) {
    console.error("Subtitles Error!: ", e.message);
  }
}

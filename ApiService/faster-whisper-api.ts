import axios from "axios";
import { Subtitle } from "../interfaces/interfaces";
const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

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
    return response.data;
  } catch (e: any) {
    console.error("Subtitles Error!: ", e.message);
  }
}

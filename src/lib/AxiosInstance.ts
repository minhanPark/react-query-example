import axios from "axios";

export const disneyInstance = axios.create({
  baseURL: "https://api.disneyapi.dev/",
});

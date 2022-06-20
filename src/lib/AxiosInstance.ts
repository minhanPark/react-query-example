import axios from "axios";

export const disneyInstance = axios.create({
  baseURL: "https://api.disneyapi.dev/",
});

export const superHerosInstance = axios.create({
  baseURL: "http://localhost:4444",
});

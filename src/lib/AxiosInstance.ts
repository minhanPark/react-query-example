import axios from "axios";

export const disneyInstance = axios.create({
  baseURL: "https://api.disneyapi.dev/",
});

export const superHerosInstance = axios.create({
  baseURL: "http://localhost:4444",
});

export const superHeroRequest = ({ ...options }: any) => {
  superHerosInstance.defaults.headers.common.Authorization = "Bearer token";
  const onSuccess = (response: any) => response;
  const onError = (error: any) => {
    return error;
  };
  return superHerosInstance(options).then(onSuccess).catch(onError);
};

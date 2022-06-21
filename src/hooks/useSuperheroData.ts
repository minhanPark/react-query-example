import { useQuery } from "react-query";
import { superHerosInstance } from "../lib/AxiosInstance";

interface Hero {
  id: number;
  name: string;
  alterEgo: string;
}

export const heroFun = async () => {
  const { data } = await superHerosInstance("/superheros");
  return data;
};

export const useSuperHerosData = (handleSuccess: any, handleError: any) => {
  return useQuery<Hero[], Error>("super-hero", heroFun, {
    enabled: false,
    onSuccess: handleSuccess,
    onError: handleError,
    select: (data) => {
      return data.map((info) => ({ ...info, name: info.name + "RW" }));
    },
  });
};

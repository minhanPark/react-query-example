import { useQuery } from "react-query";
import { superHerosInstance } from "../lib/AxiosInstance";

interface Hero {
  id: number;
  name: string;
  alterEgo: string;
}

const heroDetailFun = async (anyway: any) => {
  const { data } = await superHerosInstance(
    `/superheros/${anyway.queryKey[1]}`
  );
  return data;
};

export const useSuperHerosDetailData = (heroId: string | undefined) => {
  return useQuery<Hero, Error>(["super-hero", heroId], heroDetailFun, {
    initialData: () => {
      return {
        id: 4,
        name: "RW",
        alterEgo: "PARk",
      };
    },
  });
};

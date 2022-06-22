import { useQuery, useMutation, useQueryClient } from "react-query";
import { superHerosInstance, superHeroRequest } from "../lib/AxiosInstance";
interface Hero {
  id: number;
  name: string;
  alterEgo: string;
}

export const heroFun = async () => {
  const { data } = await superHeroRequest({ url: "/superheros" });
  return data;
};

export const addHeroFun = async (hero: any) => {
  const { data } = await superHerosInstance.post("/superheros", hero);
  return data;
};

export const useSuperHerosData = (handleSuccess: any, handleError: any) => {
  return useQuery<Hero[], Error>("super-hero", heroFun, {
    onSuccess: handleSuccess,
    onError: handleError,
    select: (data) => {
      return data.map((info) => ({ ...info, name: info.name + "RW" }));
    },
  });
};

export const useAddSuperHerosData = () => {
  const queryClient = useQueryClient();
  return useMutation(addHeroFun, {
    // onSuccess: (data) => {
    //   queryClient.setQueryData("super-hero", (oldQueryData: any) => {
    //     return [...oldQueryData, data];
    //   });
    // },
    onMutate: async (newHero) => {
      await queryClient.cancelQueries("super-hero");
      const previousHeroData = queryClient.getQueryData("super-hero");
      queryClient.setQueryData("super-hero", (oldQueryData: any) => {
        return [...oldQueryData, { id: oldQueryData?.length + 1, ...newHero }];
      });
      return {
        previousHeroData,
      };
    },
    onError: (_error, _hero, context) => {
      queryClient.setQueryData("super-hero", context?.previousHeroData);
    },
    onSettled: () => {
      queryClient.invalidateQueries("super-hero");
    },
  });
};

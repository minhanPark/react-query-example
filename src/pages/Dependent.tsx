import React from "react";
import { useQuery } from "react-query";
import { useSuperHerosDetailData } from "../hooks/useSuperHeroDetail";
import { superHerosInstance } from "../lib/AxiosInstance";

const friendDetailFun = async (id: any) => {
  const { data } = await superHerosInstance(`/friends/${id}`);
  return data;
};

const Dependent = () => {
  const {
    isLoading,
    isFetching,
    data: hero,
    isError,
    error,
  } = useSuperHerosDetailData("1");
  const heroId = hero?.id;

  const { data: friend } = useQuery(
    ["friends-detail", 1],
    () => friendDetailFun("1"),
    {
      enabled: !!heroId,
    }
  );

  if (isLoading || isFetching) {
    return <h2>Loading ....</h2>;
  }
  if (isError) {
    return <h2>{error.message}</h2>;
  }
  return (
    <div>
      <h1>Dependent</h1>
      <h2>{friend?.name}</h2>
    </div>
  );
};

export default Dependent;

import React from "react";
import { useQueries } from "react-query";
import { heroFun } from "../hooks/useSuperheroData";
import { superHerosInstance } from "../lib/AxiosInstance";

const friendsFun = async () => {
  const { data } = await superHerosInstance("/friends");
  return data;
};

const Parallel = () => {
  const queryResults = useQueries([
    {
      queryKey: "superheros",
      queryFn: heroFun,
    },
    {
      queryKey: "superfriends",
      queryFn: friendsFun,
    },
  ]);
  console.log({ queryResults });
  return <div>패럴렐</div>;
};

export default Parallel;

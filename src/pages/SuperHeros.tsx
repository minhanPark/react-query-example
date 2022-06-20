import React from "react";
import { useQuery } from "react-query";
import { superHerosInstance } from "../lib/AxiosInstance";

const heroFun = async () => {
  const { data } = await superHerosInstance("/superheros");
  return data;
};

interface Hero {
  id: number;
  name: string;
  alterEgo: string;
}

const SuperHeros: React.FC = () => {
  const handleSuccess = (data: any) => {
    console.log("Perform side effect after data fetching", data);
  };

  const handleError = (error: any) => {
    console.log("Perform side effect after data error", error);
  };
  const { isLoading, data, isError, error, isFetching, refetch } = useQuery<
    Hero[],
    Error
  >("super-hero", heroFun, {
    enabled: false,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  console.log(isLoading, isFetching);

  if (isLoading || isFetching) {
    return <h2>Loading ....</h2>;
  }
  if (isError) {
    return <h2>{error.message}</h2>;
  }
  return (
    <>
      <h2>SuperHeros Page</h2>
      <div>
        <button onClick={() => refetch()}>불러오기</button>
      </div>
      {data?.map((hero) => {
        return <div key={hero.id}>{hero.name}</div>;
      })}
    </>
  );
};

export default SuperHeros;

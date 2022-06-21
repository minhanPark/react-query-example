import { info } from "console";
import React from "react";
import { useSuperHerosData } from "../hooks/useSuperheroData";
import { Link } from "react-router-dom";

const SuperHeros: React.FC = () => {
  const handleSuccess = (data: any) => {
    console.log("Perform side effect after data fetching", data);
  };

  const handleError = (error: any) => {
    console.log("Perform side effect after data error", error);
  };
  const { isLoading, data, isError, error, isFetching, refetch } =
    useSuperHerosData(handleSuccess, handleError);

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
      {/* {data?.map((hero) => {
        return <div key={hero.id}>{hero.name}</div>;
      })} */}
      {data?.map((hero) => (
        <div key={hero.id}>
          <Link to={`/super-heros/${hero.id}`}>{hero.name}</Link>
        </div>
      ))}
    </>
  );
};

export default SuperHeros;

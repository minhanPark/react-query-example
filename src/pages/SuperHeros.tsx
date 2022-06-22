import React, { useState } from "react";
import {
  useAddSuperHerosData,
  useSuperHerosData,
} from "../hooks/useSuperheroData";
import { Link } from "react-router-dom";

const SuperHeros: React.FC = () => {
  const [name, setName] = useState("");
  const [alterEgo, setAlterEgo] = useState("");
  const handleSuccess = (data: any) => {
    console.log("Perform side effect after data fetching", data);
  };

  const handleError = (error: any) => {
    console.log("Perform side effect after data error", error);
  };
  const { isLoading, data, isError, error, isFetching, refetch } =
    useSuperHerosData(handleSuccess, handleError);

  const { mutate: addHero, isLoading: addLoading } = useAddSuperHerosData();

  const handleClick = () => {
    console.log({ name, alterEgo, addLoading });
    const hero = { name, alterEgo };
    if (!addLoading) {
      addHero(hero);
    }
  };

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
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          value={alterEgo}
          onChange={(e) => setAlterEgo(e.target.value)}
        />
        <button onClick={handleClick}>add hero</button>
      </div>
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

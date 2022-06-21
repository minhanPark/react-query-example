import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSuperHerosDetailData } from "../hooks/useSuperHeroDetail";

const SuperHeroDetail = () => {
  let { heroId } = useParams();
  let navigate = useNavigate();
  const { isLoading, isFetching, data, isError, error } =
    useSuperHerosDetailData(heroId);
  if (isLoading || isFetching) {
    return <h2>Loading ....</h2>;
  }
  if (isError) {
    return <h2>{error.message}</h2>;
  }
  return (
    <div>
      <div>
        <button onClick={() => navigate(-1)}>돌아가기</button>
      </div>
      <h1>Super hero detail</h1>
      <h2>
        {data?.name} - {data?.alterEgo}
      </h2>
    </div>
  );
};

export default SuperHeroDetail;

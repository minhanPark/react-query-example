import React from "react";
import { useQuery } from "react-query";
import { disneyInstance } from "./lib/AxiosInstance";

const getData = async () => {
  const { data } = await disneyInstance("characters");
  return data;
};

function App() {
  const { data, isError, isLoading } = useQuery("allData", getData);
  console.log(isLoading, isError, data);

  return (
    <div>
      {isLoading && <h1>로딩 중입니다.</h1>}
      <h1>아베베</h1>
    </div>
  );
}

export default App;

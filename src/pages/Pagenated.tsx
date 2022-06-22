import React, { useState } from "react";
import { useQuery } from "react-query";
import { superHerosInstance } from "../lib/AxiosInstance";

const fetchColors = async (pageNumber: any) => {
  const { data } = await superHerosInstance(
    `/colors?_limit=2&_page=${pageNumber}`
  );
  return data;
};

interface IColor {
  id: number;
  label: string;
}

const Pagenated = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const { isLoading, isError, error, data, isFetching } = useQuery<
    IColor[],
    Error
  >(["colors", pageNumber], () => fetchColors(pageNumber), {
    keepPreviousData: true,
  });
  if (isLoading) {
    return <h2>Loading ....</h2>;
  }
  if (isError) {
    return <h2>{error.message}</h2>;
  }
  return (
    <div>
      <h1>페이지네이션</h1>
      {data?.map((color) => {
        return (
          <div key={color.id}>
            <h2>
              {color.id}. {color.label}
            </h2>
          </div>
        );
      })}
      <div>
        <button
          onClick={() => setPageNumber((page) => page - 1)}
          disabled={pageNumber === 1}
        >
          Prev page
        </button>
        <button
          onClick={() => setPageNumber((page) => page + 1)}
          disabled={pageNumber === 5}
        >
          Next page
        </button>
      </div>
      {isFetching && "Loading ..."}
    </div>
  );
};

export default Pagenated;

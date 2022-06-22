import React, { Fragment } from "react";
import { useInfiniteQuery } from "react-query";
import { superHerosInstance } from "../lib/AxiosInstance";

const fetchColors = async ({ pageParam = 1 }) => {
  const { data } = await superHerosInstance(
    `/colors?_limit=2&_page=${pageParam}`
  );
  return data;
};

interface IColor {
  id: number;
  label: string;
}

const Infinite = () => {
  const {
    isLoading,
    isError,
    error,
    data,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<any>(["colors"], fetchColors, {
    getNextPageParam: (_lastPage, pages) => {
      if (pages.length < 5) {
        return pages.length + 1;
      } else {
        return undefined;
      }
    },
  });
  console.log("data is", data);
  if (isLoading) {
    return <h2>Loading ....</h2>;
  }
  if (isError) {
    return <h2>dpfj</h2>;
  }
  return (
    <div>
      <h1>인피니트</h1>
      {data?.pages[0].map((color: any) => (
        <h2 key={color.id}>
          {color.id}. {color.label}
        </h2>
      ))}
      <div>
        <button disabled={!hasNextPage}>Load more</button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </div>
  );
};

export default Infinite;

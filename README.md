# react-query example

리액트 쿼리는 리액트 애플리케이션에서 데이터를 가져오는 라이브러리이고, 서버의 state를 관리하는데 편리하다.

## 임시 데이터 만들기

```bash
npm i json-server
```

해당 모듈로 임시 서버를 만들 수 있다.

일단 루트 디렉토리에 db.json을 만들자.

```json
{
  "superheros": [
    {
      "id": 1,
      "name": "Batman",
      "alterEgo": "Bruce Wayne"
    },
    {
      "id": 2,
      "name": "Superman",
      "alterEgo": "Clark Kent"
    },
    {
      "id": 3,
      "name": "Wonder Woman",
      "alterEgo": "Princess Diana"
    }
  ]
}
```

아래와 같은 내용을 만들었다. 각 키는 path가 된다.  
위에서는 localhost:port/superheros로 get 요청을 보내면 해당 데이터를 볼 수 있다.  
get 뿐만 아니라 post, put, patch, delete까지 사용할 수 있으니 더 자세한 내용은 아래를 참고해서 공부하자.  
[공식 깃허브](https://github.com/typicode/json-server)

```json
"scripts": {
    "server": "json-server --watch db.json --port 4444"
  }
```

이제 위와 같이 어떤 json 데이터를 사용할 지, 어떤 port를 사용할 지를 넣어주면 데이터를 사용할 수 있다.

## useQuery 사용하기

useQuery는 키와 쿼리 func이 필요하다.  
키는 배열이 들어갈 수도 있고 중요한점은 유니크 해야한다.

```js
const heroFun = async () => {
  const { data } = await superHerosInstance("/superheros1");
  return data;
};
```

axios를 사용했을 경우 위와 같다.

```ts
const { isLoading, data, isError, error } = useQuery<Hero[], Error>(
  "super-hero",
  heroFun
);
```

해당 쿼리에 대한 플래그 값(isLoading, isError)들을 얻을 수 있다.  
data에는 쿼리에 대한 데이터 값이 담기고, error에는 혹시 에러가 났을 때 에러 객체가 담기게 된다.

## devTool 추가하기

따로 설치할 필요는 없고 'react-query/devtools'에 들어가 있다.

> 기본적으로 React Query Devtool은 NODE_ENV가 development인 경우에만 번들에 포함되므로 프로덕션 빌드 중에 제외할 걱정은 필요없다.

```js
import { ReactQueryDevtools } from "react-query/devtools";

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

위와 같은 형태로 QueryClientProvider 컴포넌트 아래에 두면 된다.

## staleTime과 cacheTime

staleTime은 **데이터가 fresh(신선한) 상태에서 stale(탁한) 상태로 변경되는데 걸리는 시간**을 나타낸다.

> fresh 상태일때는 쿼리 인스턴스가 새롭게 mount 되어도 fetch가 발생하지 않음.  
> staleTime이 지나지 않았다면 unmount 후에 mount 되어도 fetch가 발생하지 않음.  
> 기본값은 0이다.

cacheTime은 데이터가 inactive 상태일 때 캐싱된 상태로 남아있는 시간을 나타낸다.

> 쿼리 인스턴스가 unmount 되면 데이터는 inactive 상태로 변경되며, 캐시는 cacheTime 만큼 유지된다.  
> cacheTime이 지나면 GC로 수집된다.  
> cacheTime이 지나기 전에 쿼리 인스턴스가 다시 마운트되면, 데이터를 fetch하는 동안 캐시 데이터를 보여준다.  
> cacheTime은 staleTime과 관계없이, 무조건 inactive된 시점을 기준으로 캐시 데이터를 삭제한다.  
> 기본값은 5min 이다.

-

## React Query의 라이프 사이클

1. A쿼리 인스턴스가 mount 된다.
2. 네트워크에서 데이터 fetch하고 A라는 query key로 캐싱한다.
3. 이 데이터는 fresh(신선한) 상태에서 staleTime 이후 stale(탁한) 상태로 변경된다.
4. A 쿼리 인스턴스가 unmount 된다.
5. 캐시는 cacheTime만큼 유지되다가 GC로 수집된다.
6. cacheTime이 지나기 전에 A 쿼리 인스턴스가 새롭게 mount 되면, fetch가 실행되고, fresh한 값을 가지고 오는 동안 캐시 데이터를 보여준다.

## refetchInterval

사용방법은 아래와 같다.

```js
const { ... } = useQuery<
    Hero[],
    Error
  >("super-hero", heroFun, {
    refetchInterval: 5000,
  });
```

위와 같이 refetchInterval(기본값 false)에 number(milliseconds)를 주면 해당 시간마다 refetch를 할 수 있다.

> 만약 옵션중에 refetchIntervalInBackground 값을 true로 주면 탭/윈도우가 백그라운드 상태에 있더라도 계속 refetchInterval의 주기동안 refetch 하게 된다.

## 클릭 등 이벤트로 useQuery 다루기

기본적으로 useQuery는 컴포넌트가 마운트 될 때 같이 마운트 된다.

```js
const { isLoading, data, isError, error, isFetching, refetch } = useQuery<
   Hero[],
   Error
 >("super-hero", heroFun, {
   enabled: false,
 });
```

옵션으로 enabled 값을 false로 주면 쿼리는 자동으로 실행되지 않을 것이다.  
또한 우리가 동작시킬 수 있게 refetch를 받아온다.  
그리고 아래 처럼 이벤트로 전달하면 버튼을 클릭했을 시에 쿼리를 실행할 수 있다.

```html
<button onClick={() => refetch()}>불러오기</button>
```

## onSuccess와 onError

옵션중에 onSuccess는 fetch에 성공한 후 사이드 이펙트를 발생시킬 때, onError는 fetch에 실해한 후 사이드 이펙트를 발생시킬 때 사용한다.  
각각 파라미터를 하나씩 가지는데, onSuccess는 data(fetch한 데이터), onError은 error(에러 객체)를 가진다.

## select

useQuery에서 select를 활용하면 데이터를 변경하거나 특정 부분만 선택할 수 있다.

```js
const {...} = useQuery<
    Hero[],
    Error
  >("super-hero", heroFun, {
    enabled: false,
    onSuccess: handleSuccess,
    onError: handleError,
    select: (data) => {
      return data.map((info) => ({ ...info, name: info.name + "RW" }));
    },
  });
```

위와같이 사용할 수 있고, 그러면 data의 값이 바뀐다.

## query by id

```js
const heroDetailFun = async (heroId) => {
  const { data } = await superHerosInstance(`/superheros/${heroId}`);
  return data;
};

export const useSuperHerosDetailData = (heroId: string | undefined) => {
  return useQuery(["super-hero", heroId], () => heroDetailFun(heroId));
};
```

위와 같이 id 등의 값으로 특정 쿼리를 부를 수 있다. 아니면 기본적으로 쿼리키 부분이 전달되기 때문에 아래와 같이 설정할 수도 있다.

```js
const heroDetailFun = async ({ queryKey }) => {
  const { data } = await superHerosInstance(`/superheros/${queryKey[1]}`);
  return data;
};

export const useSuperHerosDetailData = (heroId: string | undefined) => {
  return useQuery < Hero, Error > (["super-hero", heroId], heroDetailFun);
};
```

그래서 쿼리키 부분을 확인해보니 **["super-hero", heroId]** 우리가 넣었던 이부분이 들어왔고, 여기서 1번을 사용한 것이다.  
어디서 쿼리키를 가져온 것인 지 콘솔을 찍어보니 기본적으로 들어오는 값이 아래와 같았다.

```js
{
    "queryKey": [
        "super-hero",
        "1"
    ],
    "signal": {},
    pageParam: undefined,
    meta: undefined
}
```

어떤 값들인지는 또 알아봐야 할듯

## Parallel Query

Parallel Query는 병렬로 실행되거나 동시성을 최대화하기 위해 실행되는 쿼리이다.  
일반적으로 한 페이지에서 여러개의 쿼리를 실행시키는 방법은 useQuery를 실행시켜주는 것이다.

```js
function App () {
   // The following queries will execute in parallel
   const usersQuery = useQuery('users', fetchUsers)
   const teamsQuery = useQuery('teams', fetchTeams)
   const projectsQuery = useQuery('projects', fetchProjects)
   ...
 }
```

> 만약 서스센스 모드라면 이 패턴은 동작하지 않는다. 첫번째 쿼리가 내부적으로 프로미스를 던지면 다른 쿼리가 동작하기 전에 일시 중단(suspend) 하기 때문이다. 이럴경우엔 useQueries를 사용해라.

useQueries를 사용하면 아래처럼 하면 된다.

```js
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
```

queryResults를 확인해보면 상태값들이 배열로 담겨져서 반환되는 것을 확인할 수 있다.

## dependent query

의존 상태로 부를 수 있는 방법은 enabled에 조건을 추가하는 것이다.

```js
const { data: user } = useQuery(["user", email], getUserByEmail);

const userId = user?.id;

// Then get the user's projects
const { isIdle, data: projects } = useQuery(
  ["projects", userId],
  getProjectsByUser,
  {
    // The query will not execute until the userId exists
    enabled: !!userId,
  }
);
```

그러면 예시처럼 user를 불러왔을 때 userId의 값이 undefined 일 지 아니면 id가 담길 지 결정될 것인데 !!을 통해서 해당 값을 불린으로 바꾸어서 의존적인 마운트를 할 수 있다.

> 만약 숫자 0 같은 falsy 값은 주의하자 !!을 붙이면 false가 될 것이다.

## initialData 설정하기

useQuery의 옵션중에는 initialData의 설정을 사용할 수 있음.  
또 useQueryClient 훅을 통해서 쿼리 클라이언트에 접근할 수 있는데, 해당 인스턴스를 통해서 캐시에 접근해서 기본 데이터를 가져올 수도 있다.

## 페이지네이션 구현하기

json-server는 기본적으로 페이지네이션을 구현해서 보여준다.

> http://localhost:4444/colors?\_limit=2&\_page=1

위와 같이 작성하면 2개씩 나눠서 1페이지에 해당하는 데이터를 보여준다.  
useQuery의 옵션 중에 **keepPreviousData 옵션**이 있는데, 해당 값을 true로 주면 새로운 데이터가 fetching될 때까지 이전 데이터를 유지할 수 있다.  
기본적으로 query by id를 할 때 처럼 fetch함수 만들고 페이지에 맞게 요청하면 된다.

## 무한 쿼리

useInfiniteQuery를 사용한다.  
![공식 문서 참고](https://react-query.tanstack.com/reference/useInfiniteQuery#_top)

## useMutation 사용

post 등의 요청은 useMutation 훅을 사용한다.

```js
export const addHeroFun = async (hero: any) => {
  const { data } = await superHerosInstance.post("/superheros", hero);
  return data;
};
```

이러한 쿼리 함수가 있다고 해보자.  
그러면 해당 함수를 이용해서 훅을 아래와 같이 만들 수 있다.

```js
export const useAddSuperHerosData = () => {
  return useMutation(addHeroFun);
};
```

사용할 때는 mutate 함수를 가지고 와서 사용하면 된다.

```js
const { mutate: addHero, isLoading: addLoading } = useAddSuperHerosData();

const handleClick = () => {
  console.log({ name, alterEgo, addLoading });
  const hero = { name, alterEgo };
  if (!addLoading) {
    addHero(hero);
  }
};
```

race condition을 막으려면 로딩이 아닐때만 요청을 보내면 내가 연속으로 3번 누르더라도 요청을 막고 1번만 가는 것을 확인할 수 있다.

## Invalidation from Mutations

쿼리를 무효화 하는 것은 언제 사용할 것인지가 중요하다.  
mutate 한 뒤에 쿼리 무효화를 하면 다시 쿼리를 불러오기 때문에 리스트 등이 바로 추가되는 것을 확인할 수 있다.

```js
export const useAddSuperHerosData = () => {
  const queryClient = useQueryClient();
  return useMutation(addHeroFun, {
    onSuccess: () => {
      queryClient.invalidateQueries("super-hero");
    },
  });
};
```

해당 코드는 hero를 추가한 뒤(성공한 뒤)에 쿼리 클라이언트에 접근해 super-hero키를 가진 캐시를 지운다. 그러면 추가된 모습의 리스트가 보이는 것을 확인할 수 있다.

## mutation의 response 다루기

위에서 처럼 쿼리를 무효화하면 다시 get 요청이 일어난다. mutation의 response를 통해서 다시 get 요청을 하지 않고 리스트를 추가한 모습을 볼 수 있다.

```js
export const useAddSuperHerosData = () => {
  const queryClient = useQueryClient();
  return useMutation(addHeroFun, {
    onSuccess: (data) => {
      queryClient.setQueryData("super-hero", (oldQueryData: any) => {
        return [...oldQueryData, data];
      });
    },
  });
};
```

onSuccess에는 post 성공 후 데이터가 담길 것이다.  
setQueryData를 통해서 기존 쿼리 데이터를 받아올 수 있는데, 해당 쿼리 데이터에 onSuccess에 받아온 데이터를 넣어서 배열을 리턴해주면 다시 get 요청을 할 필요없이 데이터가 추가된 것을 확인할 수 있다.

## Optimistic Update

긍정적인 업데이트를 할 때는 onMutate, onError, onSettled를 사용한다.  
**onMutate** 함수는 mutate 함수가 실행되기 전에 실행되며 mutate 함수가 받을 동일한 변수가 전달됩니다.  
이 함수에서 반환된 값은 mutate 실패의 경우 onError 및 onSettled 함수 모두에 전달되며 낙관적 업데이트를 롤백하는 데 유용할 수 있습니다.

**onSettled** 함수는 돌연변이가 성공적으로 가져오거나 오류가 발생하고 데이터 또는 오류가 전달될 때 실행됩니다.

```js
export const useAddSuperHerosData = () => {
  const queryClient = useQueryClient();
  return useMutation(addHeroFun, {
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
```

## axios 인터셉터 구현

```js
export const superHeroRequest = ({ ...options }) => {
  superHerosInstance.defaults.headers.common.Authorization = "Bearer token";
  const onSuccess = (response) => response;
  const onError = (error) => {
    return error;
  };
  return superHerosInstance(options).then(onSuccess).catch(onError);
};
```

위와 같이 axios로 인터셉터를 구현해도 똑같이 사용하면 된다.

```js
export const heroFun = async () => {
  const { data } = await superHeroRequest({ url: "/superheros" });
  return data;
};
```

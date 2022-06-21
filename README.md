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

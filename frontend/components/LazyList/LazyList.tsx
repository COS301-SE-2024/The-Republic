import {
  Fragment,
  ReactNode,
  Ref,
  useEffect,
  useImperativeHandle,
} from "react";
import equal from "fast-deep-equal";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

type Compare<D> = (one: D, two: D) => boolean;

export interface LazyListRef<D> {
  add: (data: D) => void;
  remove: (data: D, compare?: Compare<D>) => void;
  update: (data: D, newData: D, compare?: Compare<D>) => void;
}

interface LazyListProps<D> {
  Item: (props: { data: D }) => ReactNode;
  Failed: (props: { error: Error }) => ReactNode;
  Loading: () => ReactNode;
  Empty: () => ReactNode;
  fetcher: (from: number, amount: number) => Promise<D[]>;
  fetchKey: unknown[],
  pageSize: number;
  parentId?: string;
  controlRef?: Ref<LazyListRef<D>>;
  uniqueId: string;
  adFrequency?: number;
}

export function LazyList<D>({
  Item,
  Failed,
  Loading,
  Empty,
  fetcher,
  fetchKey,
  pageSize,
  parentId,
  controlRef,
  uniqueId,
  adFrequency = 0
}: LazyListProps<D>) {
  const queryClient = useQueryClient();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: fetchKey,
    queryFn: ({ pageParam }) => fetcher(pageParam, pageSize),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === 0) {
        return null;
      }

      return pages.length * pageSize;
    },
    staleTime: Number.POSITIVE_INFINITY,
  });

  useImperativeHandle(controlRef, () => ({
    add: (newData) => {
      if (!data) {
        return;
      }
      
      const newIssuesList = [newData, ...data.pages[0]];

      queryClient.setQueryData(fetchKey, {
        pages: [
          newIssuesList,
          ...data.pages.slice(1)
        ],
        pageParams: data.pageParams,
      });
    },

    remove: (newData, compare = equal) => {
      if (!data) {
        return;
      }

      const newPages = data.pages.map((page) =>
        page.filter((item) => !compare(item, newData))
      );

      queryClient.setQueryData(fetchKey, {
        pages: newPages,
        pageParams: data.pageParams,
      });
    },

    update: (oldData, newData, compare = equal) => {
      if (!data) {
        return;
      }

      const newPages = data.pages.map((page) => {
        const index = page.findIndex((item) =>
          compare(item, oldData)
        );

        return index !== -1
          ? [
            ...page.slice(0, index),
            newData,
            ...page.slice(index + 1)
          ]
          : page;
      });

      queryClient.setQueryData(fetchKey, {
        pages: newPages,
        pageParams: data.pageParams,
      });
    },
  }), [data, queryClient]);

  useEffect(() => {
    if (data && hasNextPage) {
      const handleIntersection = (
        [entry]: IntersectionObserverEntry[],
        observer: IntersectionObserver
      )  => {
        if (!entry.isIntersecting) return;

        observer.unobserve(entry.target);
        fetchNextPage();
      };

      let loadFrom = 0;
      data.pages.forEach((page) =>
        loadFrom += page.length
      );
      loadFrom -= pageSize;
      loadFrom = loadFrom > 0 ? loadFrom : 0;

      const loadFromElement = document.querySelector(
        `#item-${loadFrom}-${uniqueId}`
      );
      const rootElement = document.querySelector(
        parentId ?? `#items-scroll-${uniqueId}`
      );

      const observer = new IntersectionObserver(handleIntersection, {
        root: rootElement,
      });

      observer.observe(loadFromElement!);

      return () => {
        observer.disconnect();
      };
    }
  });

  if (adFrequency < 0) {
    adFrequency = 0;
  }

  let itemIndex = 0;
  let untilAd = adFrequency;

  return (
    <div
      className={`flex flex-col h-full ${parentId || "overflow-y-scroll"}`}
      id={`items-scroll-${uniqueId}`}
    >
      {data?.pages.every((page) => page.length === 0) && <Empty/>}

      {data?.pages.map((page, pageIndex) => (
        <Fragment key={`page-${pageIndex}-${uniqueId}`}>
          {page.map((item) => {
            const id = `item-${itemIndex++}-${uniqueId}`;

            let ad: ReactNode | null = null;
            if (adFrequency && --untilAd == 0) {
              ad = (
                <div className="h-16 relative mb-4"> 
                  <Image 
                    src={`/banner_gumball.png`}
                    alt="Banner Ad"
                    objectFit="contain"
                    fill
                  />
                  <div className={`
                    absolute 
                    left-2
                    top-[50%] -translate-y-[50%]
                    px-1 border-gray-400 border rounded 
                    text-muted-foreground text-sm
                  `}>
                    Ad
                  </div>
                </div>
              );

              untilAd = adFrequency;
            }


            return (
              <div id={id} key={id}>
                <Item data={item}/>
                {ad}
              </div>
            );
          })}
        </Fragment>
      ))}

      {error && <Failed error={error}/>}

      {isFetching && (
        <div key={`loading-${uniqueId}`}>
          <Loading/>
        </div>
      )}
    </div>
  );
}

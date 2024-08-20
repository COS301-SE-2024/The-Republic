import {
  Fragment,
  ReactNode,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import equal from "fast-deep-equal";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

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
  uniqueId?: string;
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
  uniqueId = uuidv4()
}: LazyListProps<D>) {
  const queryClient = useQueryClient();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
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
    notifyOnChangeProps: () => {
      if (data?.pages) {
        return [];
      } else {
        return 'all';
      }
    },
    staleTime: Number.POSITIVE_INFINITY,
  });
  const [, updateList] = useState({});

  useImperativeHandle(controlRef, () => ({
    add: (newData) => {
      if (!data) {
        return;
      }

      queryClient.setQueryData(fetchKey, {
        pages: [
          [newData, ...data.pages[0]],
          ...data.pages.slice(1)
        ],
        pageParams: data.pageParams,
      });
      updateList({});
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
      updateList({});
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
      updateList({});
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

  useEffect(() => {
    if (data?.pages[0] && hasNextPage) {
      const handleIntersection = async (
        [entry]: IntersectionObserverEntry[],
        observer: IntersectionObserver
      )  => {
        if (!entry.isIntersecting) return;

        observer.unobserve(entry.target);

        while (queryClient
          .getQueryState(fetchKey)
          ?.fetchStatus == 'fetching'
        ) {
          await new Promise(resolve =>
            setTimeout(resolve, 500)
          );
        }
        updateList({});
      };

      let updateFrom = 0;
      data.pages.forEach((page) =>
        updateFrom += page.length
      );

      const updateFromElement = document.querySelector(
        `#item-${updateFrom - 1}-${uniqueId}`
      );
      const rootElement = document.querySelector(
        parentId ?? `#items-scroll-${uniqueId}`
      );

      const observer = new IntersectionObserver(handleIntersection, {
        root: rootElement,
      });

      observer.observe(updateFromElement!);

      return () => {
        observer.disconnect();
      };
    }
  });

  let itemIndex = 0;

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

            return (
              <div id={id} key={id}>
                <Item data={item}/>
              </div>
            );
          })}
        </Fragment>
      ))}

      {error && <Failed error={error}/>}

      {(!error && !data?.pages || hasNextPage) && (
        <div key={`loading-${uniqueId}`}>
          <Loading/>
        </div>
      )}
    </div>
  );
}

import {
  ReactNode,
  Ref,
  useEffect,
  useImperativeHandle,
  useState
} from "react";
import { v4 as uuidv4 } from "uuid";
import equal from "fast-deep-equal";

type Compare<D> = (one: D, two: D) => boolean;

export interface LazyListRef<D> {
  reload: () => void;
  add: (data: D) => void;
  remove: (data: D, compare?: Compare<D>) => boolean;
  update: (data: D, newData: D, compare?: Compare<D>) => boolean;
}

interface LazyListProps<D> {
  Item: (props: { data: D}) => ReactNode;
  Loading: () => ReactNode;
  Empty: () => ReactNode;
  fetcher: (from: number, amount: number) => Promise<D[]>;
  pageSize: number;
  parentId?: string;
  controlRef?: Ref<LazyListRef<D>>;
  uniqueId?: string;
}

export function LazyList<D>({
  Item,
  Loading,
  Empty,
  fetcher,
  pageSize,
  parentId,
  controlRef,
  uniqueId = uuidv4()
}: LazyListProps<D>) {
  const [items, setItems] = useState<(D | "Loading" | "Deleted" )[]>(["Loading"]);

  useImperativeHandle(controlRef, () => ({
    reload: () => setItems(["Loading"]),

    add: (data) => setItems([data, ...items]),

    remove: (data, compare = equal) => {
      const index = items.findIndex((item) =>
        item !== "Loading" &&
        item !== "Deleted" &&
        compare(item, data)
      );

      if (index !== -1) {
        items[index] = "Deleted";
        setItems([...items]);

        return true;
      } else {
        return false;
      }
    },

    update: (data, newData, compare = equal) => {
      const index = items.findIndex((item) =>
        item !== "Loading" &&
        item !== "Deleted" &&
        compare(item, data)
      );

      if (index !== -1) {
        items[index] = newData;
        setItems([...items]);

        return true;
      } else {
        return false;
      }
    },
  }), [items]);

  useEffect(() => {
    if (items[items.length - 1] === "Loading") {
      let ignoreResult = false;
      const getItems = async () => {
        const fetchedItems = await fetcher(
          items.length - 1,
          pageSize,
        );

        if (ignoreResult) return;

        items.pop();
        if (fetchedItems.length > 0) {
          setItems([...items, ...fetchedItems, "Loading"]);
        } else {
          setItems([...items]);
        }
      };

      let observer: IntersectionObserver | null = null;

      if (items[0] !== "Loading") {
        const handleIntersection = (
          [entry]: IntersectionObserverEntry[],
          observer: IntersectionObserver
        )  => {
          if (!entry.isIntersecting) return;

          observer.unobserve(entry.target);
          getItems();
        };

        let loadFrom = items.length - pageSize;
        loadFrom = loadFrom > 0 ? loadFrom : 1;

        const loadFromElement = document.querySelector(
          `#item_${loadFrom}-${uniqueId}`
        );
        const rootElement = document.querySelector(
          parentId ?? `#items_scroll-${uniqueId}`
        );

        observer = new IntersectionObserver(handleIntersection, {
          root: rootElement,
        });

        observer.observe(loadFromElement!);
      } else {
        getItems();
      }

      return () => {
        ignoreResult = true;
        observer?.disconnect();
      };
    }
  });

  const isEmpty =
    items.length === 0 ||
    items.every((item) => item === "Deleted");

  return (
    <div
      className={`flex flex-col h-full ${parentId || "overflow-y-scroll"}`}
      id={`items_scroll-${uniqueId}`}
    >
      { !isEmpty
        ? items.map((item, index) => {
          const id = `item_${index + 1}-${uniqueId}`;

          return (
            <div id={id} key={id}>
              {(() => {
                switch(item) {
                  case "Loading":
                    return <Loading/>;
                  case "Deleted":
                    return <></>;
                  default:
                    return <Item data={item}/>;
                }
              })()}
            </div>
          );
        })
        : <Empty/>
      }
    </div>
  );
}

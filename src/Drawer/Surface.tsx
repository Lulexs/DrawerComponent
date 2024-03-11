import { XYCoord, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { DragItem } from "./interfaces";
import { CSSProperties, memo, useCallback, useEffect, useState } from "react";
import { Corner } from "./Corner";
import { Table } from "./Table";
import update from "immutability-helper";

const styles: CSSProperties = {
  width: "90%",
  height: "70%",
  border: "1px solid black",
  position: "relative",
};

export interface SurfaceProps {
  isCornerSelected: boolean;
  isTableSelected: boolean;
  planImage: File | null;
  exportFunctionRef: React.MutableRefObject<Function | null>;
}

const ImageComponent = memo(({ src }: { src: string }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        maxWidth: "100%",
        maxHeight: "100%",
        margin: "0",
        position: "relative",
        zIndex: 1,
      }}
    >
      <img
        style={{ maxWidth: "90%", maxHeight: "90%" }}
        src={src}
        alt="There was a mistake loading your image, please try again..."
      />
    </div>
  );
});

export function Surface(props: SurfaceProps) {
  const [items, setItems] = useState<{
    [key: string]: { top: number; left: number; type: string };
  }>({});

  const [corners, setCorners] = useState<
    [HTMLElement | null, HTMLElement | null]
  >([null, null]);

  const [lines, setLines] = useState<
    {
      corner1: HTMLElement;
      corner2: HTMLElement;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }[]
  >([]);

  function exportPlan() {
    const plan = {
      items: items,
      lines: lines.map((line) => ({
        corner1: line.corner1.id,
        corner2: line.corner2.id,
        x1: line.x1,
        y1: line.y1,
        x2: line.x2,
        y2: line.y2,
      })),
      image: props.planImage,
    };
    return plan;
  }

  useEffect(() => {
    if (corners[0] && corners[1] && corners[0] === corners[1])
      setCorners([null, null]);
    else if (
      corners[0] &&
      corners[1] &&
      !lines.some(
        (l) =>
          (l.corner1 === corners[0] && l.corner2 === corners[1]) ||
          (l.corner1 === corners[1] && l.corner2 === corners[0])
      )
    ) {
      const [x1, y1] = [
        parseFloat(corners[0].style.left),
        parseFloat(corners[0].style.top),
      ];
      const [x2, y2] = [
        parseFloat(corners[1].style.left),
        parseFloat(corners[1].style.top),
      ];
      setLines((l) => [
        ...l,
        { corner1: corners[0]!, corner2: corners[1]!, x1, y1, x2, y2 },
      ]);
      setCorners([null, null]);
      return;
    } else if (corners[0] && corners[1]) {
      setCorners([null, null]);
      setLines((l) =>
        l.filter(
          (line) =>
            line.corner1 !== corners[0] &&
            line.corner2 !== corners[1] &&
            line.corner1 !== corners[1] &&
            line.corner2 !== corners[0]
        )
      );
    }
  }, [corners]);

  useEffect(() => {
    rearrangeLines();
  }, [items]);

  useEffect(() => {
    props.exportFunctionRef.current = exportPlan;
  }, [items, lines, props.planImage]);

  const rearrangeLines = () => {
    setLines((l) =>
      l.map((line) => ({
        ...line,
        x1: parseFloat(line.corner1.style.left),
        y1: parseFloat(line.corner1.style.top),
        x2: parseFloat(line.corner2.style.left),
        y2: parseFloat(line.corner2.style.top),
      }))
    );
  };

  const moveitems = useCallback(
    (id: string, left: number, top: number) => {
      setItems(
        update(items, {
          [id]: {
            $merge: { left, top },
          },
        })
      );
    },
    [items, setItems]
  );

  const [, drop] = useDrop(
    () => ({
      accept: [ItemTypes.CORNER, ItemTypes.CHAIR, ItemTypes.TABLE],
      drop(item: DragItem, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);
        moveitems(item.id, left, top);
        return undefined;
      },
    }),
    [moveitems]
  );

  function spawnNewItem(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (props.isTableSelected) {
      const { x, y } = event.currentTarget.getBoundingClientRect();
      const newItem = {
        top: event.clientY - y,
        left: event.clientX - x,
        type: ItemTypes.TABLE,
      };
      setItems({ ...items, [Math.random().toString()]: newItem });
    } else if (props.isCornerSelected) {
      const { x, y } = event.currentTarget.getBoundingClientRect();
      const newItem = {
        top: event.clientY - y,
        left: event.clientX - x,
        type: ItemTypes.CORNER,
      };
      setItems({ ...items, [Math.random().toString()]: newItem });
    }
  }

  function unspawnItem(key: string) {
    setItems((i) => {
      const updatedItems = { ...i };
      delete updatedItems[key];
      return updatedItems;
    });
  }

  return (
    <div
      ref={drop}
      style={{
        ...styles,
        textAlign: "center",
        zIndex: 1,
      }}
      onClick={spawnNewItem}
    >
      {Object.keys(items).map((key) => {
        const { left, top, type } = items[key] as {
          top: number;
          left: number;
          type: string;
        };
        if (type == ItemTypes.TABLE) {
          return (
            <Table
              key={key}
              id={key}
              left={left}
              top={top}
              onRemove={() => {
                unspawnItem(key);
              }}
            />
          );
        } else if (type == ItemTypes.CORNER) {
          return (
            <Corner
              key={key}
              id={key}
              left={left}
              top={top}
              selectCorner={setCorners}
              selectedCorners={corners}
              onRemove={() => {
                unspawnItem(key);
              }}
            />
          );
        }
      })}
      <svg
        style={{
          width: "100%",
          height: "100%",
          zIndex: 2,
        }}
      >
        <foreignObject style={{ width: "90%", height: "90%" }}>
          {props.planImage && (
            <ImageComponent src={URL.createObjectURL(props.planImage!)} />
          )}
        </foreignObject>
        {lines.map((line, index) => (
          <line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            style={{
              stroke: "red",
              strokeWidth: 2,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

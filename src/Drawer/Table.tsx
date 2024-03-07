import { CSSProperties, FC } from "react";
import { ItemTypes } from "./ItemTypes";
import { useDrag } from "react-dnd";

export interface TableInterface {
  id: string;
  top: number;
  left: number;
}

const TableStyle: CSSProperties = {
  position: "absolute",
  width: "30px",
  height: "30px",
  border: "1px solid gray",
  backgroundColor: "gray",
  cursor: "move",
  margin: 0,
};

export const Table: FC<TableInterface> = ({ id, top, left }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.TABLE,
      item: { id, top, left },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, top, left]
  );

  if (isDragging) {
    return <div ref={drag}></div>;
  }

  return (
    <div
      ref={drag}
      style={{ ...TableStyle, top, left }}
      data-testid="table"
    ></div>
  );
};

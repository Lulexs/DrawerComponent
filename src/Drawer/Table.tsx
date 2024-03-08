import { CSSProperties, FC } from "react";
import { ItemTypes } from "./ItemTypes";
import { useDrag } from "react-dnd";

export interface TableInterface {
  id: string;
  top: number;
  left: number;
  onRemove: () => void;
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

export const Table: FC<TableInterface> = ({ id, top, left, onRemove }) => {
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
      id={id}
      ref={drag}
      style={{ ...TableStyle, top, left }}
      data-testid="table"
      onClick={(e) => {
        e.stopPropagation();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onRemove();
      }}
    ></div>
  );
};

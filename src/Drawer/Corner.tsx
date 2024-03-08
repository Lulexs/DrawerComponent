import { CSSProperties, FC } from "react";
import { ItemTypes } from "./ItemTypes";
import { useDrag } from "react-dnd";

export interface CornerInterface {
  id: string;
  top: number;
  left: number;
  selectedCorners: [HTMLElement | null, HTMLElement | null];
  selectCorner: React.Dispatch<
    React.SetStateAction<[HTMLElement | null, HTMLElement | null]>
  >;
  onRemove: () => void;
}

const CornerStyle: CSSProperties = {
  position: "absolute",
  width: "10px",
  height: "10px",
  border: "1px solid black",
  backgroundColor: "white",
  cursor: "move",
  margin: 0,
};

export const Corner: FC<CornerInterface> = ({
  id,
  top,
  left,
  selectedCorners,
  selectCorner,
  onRemove,
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.CORNER,
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

  function onClickCorner(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.stopPropagation();
    selectCorner([
      selectedCorners[0] ? selectedCorners[0] : selectedCorners[1],
      event.currentTarget,
    ]);
  }

  return (
    <div
      id={id}
      ref={drag}
      style={{
        ...CornerStyle,
        top,
        left,
      }}
      onClick={onClickCorner}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onRemove();
      }}
      data-testid="corner"
    ></div>
  );
};

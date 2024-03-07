import { Group } from "@mantine/core";

export interface ToolbarProps {
  cornerState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  tableState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export default function Toolbar(props: ToolbarProps) {
  return (
    <Group>
      <p
        style={{
          border: props.cornerState[0] ? "1px solid black" : "none",
          padding: "5px",
        }}
        onClick={() => {
          props.cornerState[1](!props.cornerState[0]);
          props.tableState[1](false);
        }}
      >
        Corner
      </p>
      <p
        style={{
          border: props.tableState[0] ? "1px solid black" : "none",
          padding: "5px",
        }}
        onClick={() => {
          props.tableState[1](!props.tableState[0]);
          props.cornerState[1](false);
        }}
      >
        Table
      </p>
    </Group>
  );
}

import { DndProvider } from "react-dnd";
import { Surface } from "./Surface";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Flex, Group } from "@mantine/core";
import Toolbar from "./Toolbar";
import React, { useState } from "react";



export default function Drawer() {
  const [isCornerSelected, setIsCornerSelected] = useState<boolean>(false);
  const [isTableSelected, setIsTableSelected] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = event.target.files && event.target.files[0];
    setImage(selectedImage || null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Flex
        align="center"
        justify="center"
        direction="column"
        w="100%"
        h="100%"
      >
        <h2 style={{ color: "hsla(0, 0%, 57%, 0.397)", marginBottom: "0" }}>
          Please draw table/seat plan
        </h2>
        <Group align="center" justify="center">
          <Toolbar
            cornerState={[isCornerSelected, setIsCornerSelected]}
            tableState={[isTableSelected, setIsTableSelected]}
          />
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
          />
        </Group>
        <Surface
          isCornerSelected={isCornerSelected}
          isTableSelected={isTableSelected}
          planImage={image}
        />
      </Flex>
    </DndProvider>
  );
}

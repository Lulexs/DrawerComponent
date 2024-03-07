import { MantineProvider } from "@mantine/core";
import Drawer from "./Drawer/Drawer";
function App() {
  return (
    <>
      <MantineProvider>
        <Drawer />
      </MantineProvider>
    </>
  );
}

export default App;

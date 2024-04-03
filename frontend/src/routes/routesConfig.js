import { HomePage } from "../pages/HomePage";
import { RoomPage } from "../pages/room/RoomPage";

const routesConfig = [
  {
    path: "/",
    component: HomePage,
    exact: true,
  },
  {
    path: "/room-game",
    component: RoomPage,
    exact: true,
  },
];

export default routesConfig;

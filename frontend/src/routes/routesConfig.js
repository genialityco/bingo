import { HomePage } from "../pages/HomePage";
import { PlayBingoPage } from "../pages/playBingo/PlayBingoPage";
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
  {
    path: "/play-bingo",
    component: PlayBingoPage,
    exact: true,
  },
];

export default routesConfig;

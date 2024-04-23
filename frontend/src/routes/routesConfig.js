import { HomePage } from "../pages/HomePage";
import BingoConfig from "../pages/bingoConfig/BingoConfig";
import BingosList from "../pages/bingoConfig/BingosList";
import { PlayBingoPage } from "../pages/playBingo/PlayBingoPage";
import { RoomPage } from "../pages/room/RoomPage";
import { RoomPageV1 } from "../pages/room/RoomPageV1";

const routesConfig = [
  {
    path: "/",
    component: HomePage,
    exact: true,
  },
  {
    path: "/room-game",
    component: RoomPageV1,
    exact: true,
  },
  {
    path: "/play-bingo",
    component: PlayBingoPage,
    exact: true,
  },
  {
    path:"/bingo-config",
    component:BingoConfig,
    exact:true
  },
  {
    path:"/list-bingos",
    component:BingosList,
    exact:true
  }
];

export default routesConfig;

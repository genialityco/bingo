import { HomePage } from "../pages/HomePage";
import BingoConfig from "../pages/bingoConfig/BingoConfig";
import BingosList from "../pages/bingoConfig/BingosList";
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

import { HomePage } from "../pages/HomePage";
import BingosList from "../pages/customizeBingoView/BingosList";
import CustomizeBingo from "../pages/customizeBingoView/CustomizeBingo";
import { BingoControlPanel } from "../pages/bingoControlPanelView/BingoControlPanel";
import { PlayerBingoPage } from "../pages/playerBingoView/PlayerBingoPage";

const routesConfig = [
  {
    path: "/",
    component: HomePage,
    exact: true,
  },
  {
    path: "/bingo-game/:bingoCode/:bingoId",
    component: PlayerBingoPage,
    exact: true,
  },
  {
    path: "/play-bingo/:bingoId",
    component: BingoControlPanel,
    exact: true,
  },
  {
    path: "/customize-bingo",
    component: CustomizeBingo,
    exact: true,
  },
  {
    path: "/list-bingos",
    component: BingosList,
    exact: true,
  },
];

export default routesConfig;

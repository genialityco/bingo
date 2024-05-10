import React from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { ShowLastBallot } from "./ShowLastBallot";
import { BallotHistory } from "./BallotHistory";
import { BingoFigure } from "./BingoFigure";

export const TabsSection = ({
  bingoConfig,
  lastBallot,
  messageLastBallot,
  ballotsHistory,
}) => {
  const dataTabs = [
    {
      label: "Balotas",
      value: "balls",
      content: (
        <ShowLastBallot
          bingoConfig={bingoConfig}
          lastBallot={lastBallot}
          messageLastBallot={messageLastBallot}
        />
      ),
    },
    {
      label: "Historial de balotas",
      value: "HistoryBalls",
      content: (
        <BallotHistory
          bingoConfig={bingoConfig}
          ballotsHistory={ballotsHistory}
        />
      ),
    },
    {
      label: "Figura",
      value: "Figure",
      content: <BingoFigure bingoConfig={bingoConfig} />,
    },
  ];

  return (
    <Tabs value="balls">
      {bingoConfig && (
        <TabsHeader>
          {dataTabs.map(({ label, value }) => (
            <Tab key={value} value={value}>
              {label}
            </Tab>
          ))}
        </TabsHeader>
      )}
      {bingoConfig && (
        <TabsBody className="w-full">
          {dataTabs.map(({ value, content }) => (
            <TabPanel key={value} value={value} className="w-full">
              {content}
            </TabPanel>
          ))}
        </TabsBody>
      )}
    </Tabs>
  );
};

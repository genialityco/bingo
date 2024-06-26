import React, { useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

export const CustomBingoTabs = ({ data }) => {

  const [activeTab, setActiveTab] = useState(data[0].value);

  return (
    <Tabs value={activeTab} onChange={(newValue) => setActiveTab(newValue)} className="w-full">
      <TabsHeader
        className="bg-gray-200 flex justify-center items-center"
        indicatorProps={{
          className: "bg-gray-900/10 shadow-none !text-gray-900",
        }}
      >
        {data.map(({ label, value }) => (
          <Tab key={value} value={value}>
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody>
        {data.map(({ value, desc }) => (
          <TabPanel key={value} value={value}>
            {desc}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
};

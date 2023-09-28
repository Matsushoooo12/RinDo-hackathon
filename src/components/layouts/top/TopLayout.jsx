import { Box } from "@chakra-ui/react";
import React from "react";
import TopHeader from "./TopHeader";

const TopLayout = ({ children }) => {
  return (
    <Box>
      <TopHeader />
      {children}
    </Box>
  );
};

export default TopLayout;

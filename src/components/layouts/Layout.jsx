import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <Box>
      <Header />
      {children}
    </Box>
  );
};

export default Layout;

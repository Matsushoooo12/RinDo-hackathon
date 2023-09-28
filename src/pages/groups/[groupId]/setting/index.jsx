import { Flex, HStack, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { AiOutlineSetting } from "react-icons/ai";

const Settings = () => {
  return (
    <>
      <Flex
        w="100%"
        h="40px"
        borderBottom="0.3px solid black"
        borderColor="gray.200"
        alignItems="center"
        px={4}
      >
        <HStack spacing={4}>
          <Icon w="20px" h="20px" as={AiOutlineSetting} />
          <Text fontWeight="bold">Setting</Text>
        </HStack>
      </Flex>
    </>
  );
};

export default Settings;

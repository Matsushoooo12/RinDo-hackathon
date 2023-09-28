import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

const CreateProject = () => {
  const router = useRouter();
  return (
    <>
      <Flex
        w="100%"
        h="40px"
        borderBottom="0.3px solid black"
        borderColor="gray.200"
        alignItems="center"
        justifyContent="space-between"
        px={4}
      >
        <HStack spacing={2}>
          <Box w="20px" h="28px" bg="gray.200" borderRadius="sm" />
          <Text fontWeight="bold">
            <span style={{ color: "#319795" }}>リーダブルコード</span>
            で輪読会を開く
          </Text>
        </HStack>
      </Flex>
    </>
  );
};

export default CreateProject;

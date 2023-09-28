import {
  Avatar,
  Box,
  Center,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineSetting, AiOutlineSearch } from "react-icons/ai";
import { BiHelpCircle } from "react-icons/bi";
import { LiaCircle } from "react-icons/lia";

const TopHeader = () => {
  const router = useRouter();
  return (
    <Flex
      w="100%"
      h="80px"
      borderBottom="1px solid black"
      borderColor="gray.200"
      justify="space-between"
      alignItems="center"
      px={8}
    >
      <HStack spacing={2} mr={10}>
        <Box w="100px" h="32px" bg="gray.300" mr={4} />
        <Box
          py={1}
          px={3}
          _hover={{ bg: "teal.100", color: "teal.700" }}
          borderRadius="full"
          transition="ease-in-out 0.2s"
          cursor="pointer"
          onClick={() => router.push("/")}
        >
          <Text fontWeight="bold" whiteSpace="nowrap">
            RinDoとは
          </Text>
        </Box>
        <Box
          py={1}
          px={3}
          _hover={{ bg: "teal.100", color: "teal.700" }}
          borderRadius="full"
          transition="ease-in-out 0.2s"
          cursor="pointer"
          onClick={() => router.push("/about")}
        >
          <Text fontWeight="bold" whiteSpace="nowrap">
            使い方
          </Text>
        </Box>
        <Box
          py={1}
          px={3}
          _hover={{ bg: "teal.100", color: "teal.700" }}
          borderRadius="full"
          transition="ease-in-out 0.2s"
          cursor="pointer"
          onClick={() => router.push("/plan")}
        >
          <Text fontWeight="bold" whiteSpace="nowrap">
            プラン
          </Text>
        </Box>
      </HStack>
      <HStack>
        <Center
          py={1}
          px={3}
          border="1px solid black"
          borderColor="gray.200"
          borderRadius="xl"
          fontSize="sm"
          _hover={{ bg: "gray.100" }}
          transition="ease-in-out 0.2s"
          cursor="pointer"
        >
          Log In
        </Center>
        <Center
          py={1}
          px={3}
          border="1px solid black"
          borderColor="gray.200"
          borderRadius="xl"
          fontSize="sm"
          _hover={{ bg: "teal.100" }}
          transition="ease-in-out 0.2s"
          cursor="pointer"
          bg="teal.200"
        >
          Sign Up
        </Center>
      </HStack>
    </Flex>
  );
};

export default TopHeader;

import {
  Avatar,
  Box,
  Center,
  Flex,
  GridItem,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";

const UserCard = (props) => {
  const { user, onClick } = props;

  const memberStatusColor = (status) => {
    if (status === "manager") {
      return "red.500";
    } else if (status === "organizer") {
      return "teal.500";
    } else if (status === "participant") {
      return "blue.500";
    }
  };
  return (
    <GridItem
      w="100%"
      border="0.3px solid black"
      borderColor="gray.200"
      borderRadius="md"
      cursor="pointer"
      _hover={{ bg: "gray.100" }}
      transition="ease-in-out 0.2s"
      position="relative"
      boxShadow="md"
      onClick={onClick}
    >
      <Center
        margin="auto"
        left="0"
        right="0"
        position="absolute"
        top="46px"
        bg="white"
        w="74px"
        h="74px"
        borderRadius="full"
        zIndex={10}
      >
        <Avatar w="64px" h="64px" src={user.photoUrl} />
      </Center>
      <Box position="relative">
        <Image
          w="100%"
          h="80px"
          src={user.backgroundImageUrl}
          alt=""
          borderTopRadius="md"
        />
        {user.status && (
          <Box
            position="absolute"
            right="10px"
            top="10px"
            w="20px"
            h="20px"
            bg={memberStatusColor(user.status)}
            borderRadius="full"
          />
        )}
      </Box>
      <Box px={4} pt={10}>
        <VStack spacing={1}>
          <Text fontWeight="bold">{user.displayName}</Text>
          <Text fontSize="xs" fontWeight="bold" color="gray.500">
            @{user.userId}
          </Text>
        </VStack>
      </Box>
      <HStack m={4} borderTop="1px solid black" borderColor="gray.200" pt={4}>
        <Flex
          flex={1}
          p={2}
          border="1px solid black"
          borderColor="gray.200"
          borderRadius="xl"
          direction="column"
          alignItems="center"
        >
          <Text fontSize="xs" fontWeight="bold">
            Books
          </Text>
          <Text fontWeight="bold">
            {user?.bookIds?.length ? user?.bookIds?.length : 0}
          </Text>
        </Flex>
        <Flex
          flex={1}
          p={2}
          border="1px solid black"
          borderColor="gray.200"
          borderRadius="xl"
          direction="column"
          alignItems="center"
        >
          <Text fontSize="xs" fontWeight="bold">
            Level
          </Text>
          <Text fontWeight="bold">{user.level}</Text>
        </Flex>
        <Flex
          flex={1}
          p={2}
          border="1px solid black"
          borderColor="gray.200"
          borderRadius="xl"
          direction="column"
          alignItems="center"
        >
          <Text fontSize="xs" fontWeight="bold">
            Skill
          </Text>
          <Image
            w="24px"
            h="24px"
            src={user.skillImageUrl}
            alt=""
            borderRadius="full"
          />
        </Flex>
      </HStack>
    </GridItem>
  );
};

export default UserCard;

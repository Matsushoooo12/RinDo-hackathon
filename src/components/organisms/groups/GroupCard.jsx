import {
  Avatar,
  AvatarGroup,
  Flex,
  GridItem,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";

const GroupCard = (props) => {
  const { group, onClick } = props;
  return (
    <GridItem
      w="100%"
      border="1px solid black"
      borderColor="gray.200"
      borderRadius="md"
      p={4}
      cursor="pointer"
      _hover={{ bg: "gray.100" }}
      transition="ease-in-out 0.2s"
      boxShadow="md"
      onClick={onClick}
    >
      <HStack spacing={4}>
        <Image
          w="64px"
          h="64px"
          alt=""
          src={group.imageUrl}
          borderRadius="xl"
        />
        <VStack alignItems="flex-start" justifyContent="space-between">
          <Text fontWeight="bold" fontSize="sm">
            {group.name}
          </Text>
          <AvatarGroup size="xs" max={5}>
            {group.members?.map((member) => (
              <Avatar
                key={member?.id}
                name={member?.displayName}
                src={member?.photoUrl}
              />
            ))}
          </AvatarGroup>
        </VStack>
      </HStack>
      <HStack mt={4} borderTop="1px solid black" borderColor="gray.200" pt={4}>
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
          <Text fontWeight="bold">{group.books?.length}</Text>
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
            Score
          </Text>
          <Text fontWeight="bold">{group.score}</Text>
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
            src={group.skillImageUrl}
            alt=""
            borderRadius="full"
          />
        </Flex>
      </HStack>
    </GridItem>
  );
};

export default GroupCard;

import { GridItem, Image, Text, VStack } from "@chakra-ui/react";
import React from "react";

const MemberCard = (props) => {
  const { member, onClick } = props;
  const statusBgColor = (status) => {
    if (status === "manager") {
      return "red.100";
    } else if (status === "organizer") {
      return "teal.100";
    } else {
      return "blue.100";
    }
  };
  const statusTextColor = (status) => {
    if (status === "manager") {
      return "red.700";
    } else if (status === "organizer") {
      return "teal.700";
    } else {
      return "blue.700";
    }
  };
  return (
    <GridItem
      onClick={onClick}
      w="100%"
      border="1px solid black"
      borderColor="gray.200"
      borderRadius="md"
      cursor="pointer"
      _hover={{ bg: "gray.100" }}
      transition="ease-in-out 0.2s"
    >
      <Image
        w="100%"
        h="160px"
        src={member.photoUrl}
        alt=""
        objectFit="cover"
        borderTopRadius="md"
      />
      <VStack alignItems="flex-start" p={2}>
        <Text fontSize="sm" fontWeight="bold">
          {member.displayName}
        </Text>
        <Text
          py={1}
          px={3}
          fontSize="xs"
          bg={statusBgColor(member.status)}
          fontWeight="bold"
          borderRadius="full"
          color={statusTextColor(member.status)}
        >
          {member.status}
        </Text>
      </VStack>
    </GridItem>
  );
};

export default MemberCard;

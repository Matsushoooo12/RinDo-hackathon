import { Badges } from "@/components/atoms/Badges";
import {
  Box,
  Flex,
  GridItem,
  HStack,
  Icon,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { IoFootstepsOutline } from "react-icons/io5";

const ProjectCard = (props) => {
  const { project, onClick } = props;
  return (
    <GridItem
      cursor="pointer"
      borderRadius="md"
      border="1px solid black"
      borderColor="gray.200"
      transition="ease-in-out 0.2s"
      onClick={onClick}
      boxShadow="md"
    >
      <Flex w="100%" h="96px" position="relative">
        <Image
          src={project.backgroundImageUrl}
          bg="gray.300"
          borderTopRadius="md"
          w="100%"
          alt=""
          objectFit="cover"
        />
      </Flex>
      <VStack p={4} alignItems="flex-start" spacing={2}>
        <HStack spacing={4}>
          <HStack
            fontSize="xs"
            color="teal.700"
            fontWeight="bold"
            borderRadius="md"
            borderColor="teal.300"
          >
            <Icon as={IoFootstepsOutline} />
            <Text whiteSpace="nowrap">{project.status}</Text>
          </HStack>
          <HStack
            fontSize="xs"
            color="purple.700"
            fontWeight="bold"
            borderRadius="md"
            borderColor="purple.300"
          >
            <Icon as={AiOutlineCalendar} />
            <Text whiteSpace="nowrap">
              {dayjs(project.deadline.toDate()).format("YYYY-MM-DD")}
            </Text>
          </HStack>
          <HStack
            fontSize="xs"
            color="green.700"
            fontWeight="bold"
            borderRadius="md"
            borderColor="green.300"
          >
            <Icon as={BiUser} />
            <Text>{project.members?.length}</Text>
          </HStack>
        </HStack>
        <HStack alignItems="flex-start">
          <Image
            src={project.book.imageUrl}
            w="40px"
            h="56px"
            bg="gray.300"
            borderRadius="sm"
            alt=""
          />
          <VStack justifyContent="space-between">
            <Text fontWeight="bold">{project.book.title}</Text>
            <Badges isBook tags={project.book.tags} />
          </VStack>
        </HStack>
      </VStack>
    </GridItem>
  );
};

export default ProjectCard;

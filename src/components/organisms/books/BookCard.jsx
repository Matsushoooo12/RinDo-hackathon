import { Badges } from "@/components/atoms/Badges";
import { Rating } from "@/components/atoms/Rating";
import { useRoutingCheck } from "@/hooks/useRoutingCheck";
import {
  Box,
  Flex,
  GridItem,
  Icon,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

const BookCard = (props) => {
  const { book, onClick } = props;
  const { groupLibraryUrl } = useRoutingCheck();
  const groupBookStatusColor = (status) => {
    if (status === "participating") {
      return "teal.500";
    } else if (status === "completed") {
      return "red.500";
    } else if (status === "stock") {
      return "blue.500";
    }
  };
  return (
    <GridItem
      onClick={onClick}
      w="100%"
      border="0.3px solid black"
      borderColor="gray.200"
      borderRadius="md"
      p={4}
      cursor="pointer"
      _hover={{ bg: "gray.100" }}
      transition="ease-in-out 0.2s"
      boxShadow="md"
      position="relative"
    >
      {groupLibraryUrl() && (
        <Icon
          position="absolute"
          right="20px"
          fontSize="2xl"
          top="0px"
          as={BsBookmarkFill}
          color={() => groupBookStatusColor(book.status)}
        />
      )}
      <Flex>
        <Image
          w="80px"
          h="124px"
          borderRadius="md"
          mr={4}
          alt=""
          src={book.imageUrl}
        />
        <VStack alignItems="flex-start" flex={1}>
          <Text fontSize="sm" fontWeight="bold">
            {book.title}
          </Text>
          <Rating size={14} rating={book.rating} />
          <Text
            css={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            fontSize="xs"
          >
            {book.description}
          </Text>
          <Badges isBook tags={book.tags} />
        </VStack>
      </Flex>
    </GridItem>
  );
};

export default BookCard;

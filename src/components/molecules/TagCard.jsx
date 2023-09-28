import React from "react";
import { Text, VStack } from "@chakra-ui/react";
import TagIcon from "../atoms/TagIcon";

const TagCard = ({ tag }) => {
  return (
    <VStack>
      <TagIcon tag={tag} />
      <Text fontSize="sm">{tag.name}</Text>
    </VStack>
  );
};

export default TagCard;

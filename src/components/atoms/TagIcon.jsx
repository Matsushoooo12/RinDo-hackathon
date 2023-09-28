import React from "react";
import { Center, Icon } from "@chakra-ui/react";
import Image from "next/image";
import { HiHashtag } from "react-icons/hi";

const TagIcon = ({ tag, size = 1 }) => {
  const imageSize = 40 * size;
  const iconSize = 10 * size;
  return (
    <Center h={12} objectFit="contain" p={2}>
      {tag?.imageUrl ? (
        <Image
          style={{ borderRadius: "50%" }}
          alt={tag.name}
          height={imageSize}
          src={tag.imageUrl}
          width={imageSize}
        />
      ) : (
        <Icon as={HiHashtag} color="teal.400" h={iconSize} w={iconSize} />
      )}
    </Center>
  );
};

export default TagIcon;

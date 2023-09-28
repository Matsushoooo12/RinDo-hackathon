import { Badge, Text, Wrap, WrapItem, HStack, Icon } from "@chakra-ui/react";
import Image from "next/image";
import { BsHash } from "react-icons/bs";

// TODO 汎用性を持たせるならこのコンポーネントにWrapを持たせない方がいい
export const Badges = ({
  tags,
  tagLimit,
  isSmall = false,
  isBook = false,
  isPointer = false,
}) => {
  // 文字数が長いタグが並びすぎるとレイアウト崩壊するので、制限を設ける
  const _tagLimit = 3;
  const _tags = isSmall ? tags.slice(0, _tagLimit) : tags;
  const fontSize = isSmall ? 11 : 14;

  return (
    <Wrap align="flex-start" alignSelf="flex-start">
      {_tags?.slice(0, _tagLimit)?.map((tag, index) => (
        <WrapItem key={index}>
          <HStack
            color="black"
            border="0.3px solid #000"
            borderColor="gray.300"
            borderRadius="full"
            bg="white"
            px={2}
            py={0.5}
            alignItems="center"
          >
            {isBook && (
              <>
                {tag.imageUrl ? (
                  <Image
                    width={12}
                    height={12}
                    alt=""
                    src={tag.imageUrl}
                    style={{ borderRadius: "100px" }}
                  />
                ) : (
                  <Icon color="teal.400" as={BsHash} />
                )}
              </>
            )}
            <Text fontSize="xs">{tag.name}</Text>
          </HStack>
        </WrapItem>
      ))}
      {tags?.length > _tagLimit && isSmall && (
        <Text fontSize={fontSize} lineHeight={1.5}>
          ...
        </Text>
      )}
    </Wrap>
  );
};

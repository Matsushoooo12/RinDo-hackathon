import { HStack, Icon } from "@chakra-ui/react";
import { BsStarHalf, BsStarFill, BsStar } from "react-icons/bs";

// 固定5段階評価
export const Rating = ({ size, rating }) => {
  const fullStars = Math.floor(rating); // 全て塗りつぶした星の数
  const halfStar = rating % 1 !== 0; // 半分塗りつぶした星があるかどうか
  const starColor = "yellow.500";

  return (
    <HStack>
      {[...Array(fullStars).keys()].map((i) => (
        <Icon as={BsStarFill} color={starColor} fontSize={size} key={i} />
      ))}
      {halfStar && <Icon as={BsStarHalf} color={starColor} fontSize={size} />}
      {[...Array(5 - Math.ceil(rating)).keys()].map((i) => (
        <Icon
          as={BsStar}
          color={starColor}
          fontSize={size}
          key={i + Math.ceil(rating)}
        />
      ))}
    </HStack>
  );
};

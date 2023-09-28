import React from "react";
import { Grid, Link, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import TagCard from "../molecules/TagCard";

const Tags = ({ tags, setIsFocus }) => {
  const router = useRouter();
  return (
    <Grid
      gap={4}
      templateColumns={{
        base: "repeat(3, 1fr)",
        sm: "repeat(3, 1fr)",
        md: "repeat(4, 1fr)",
      }}
    >
      {tags?.map((tag) => (
        <Box
          bg="white"
          borderRadius="md"
          css={{
            boxShadow: "0 8px 20px 0 rgba( 131, 138, 135, 0.1 )",
            border: "1px solid rgba( 255, 255, 255, 0.25 )",
          }}
          cursor="pointer"
          h="full"
          onClick={() => {
            router.push(`/books?query=${tag.id}`);
            setIsFocus(false);
          }}
          key={tag.id}
          p={2}
          transition="all 0.2s"
        >
          <TagCard tag={tag} />
        </Box>
      ))}
    </Grid>
  );
};

export default Tags;

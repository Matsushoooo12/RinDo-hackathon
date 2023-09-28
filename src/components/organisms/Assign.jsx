import { imgUrl, presentImages } from "@/lib/data";
import {
  Box,
  Flex,
  HStack,
  Icon,
  Image,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/router";
import React, { useState } from "react";

// 章アサインの最初のみ用コンポーネント
const Assign = ({ iteration, chapters, players }) => {
  const router = useRouter();
  const toast = useToast();
  const sensors = useSensors(useSensor(PointerSensor));

  const isFirst = iteration === 0;

  // どの章にどのユーザがアサインされたかを記憶
  const [map, setMap] = useState(
    new Map(chapters?.map((chapter) => [chapter?.index, null]))
  );

  const hideSM = { base: "none", md: "block" };

  function handleDragEnd({ over, active }) {
    const user = findUserById(active.id, players);
    const chapter = chapters?.find((chapter) => chapter?.index == over?.id);
    if (!user || !over || !chapter) return;

    const updateMap = new Map(map);
    updateMap.set(over.id, { user, chapter });
    setMap(updateMap);
  }

  function removeAssign(id) {
    const updateMap = new Map(map);
    const { chapter } = map.get(id) || {};
    updateMap.set(id, { user: null, chapter });
    setMap(updateMap);
  }

  // アサインされたユーザを探し出して表示
  const AssignedPlayer = ({ chapterId }) => {
    const { user } = map.get(chapterId) || {};
    if (!user) return <></>;
    return <Player id={`${chapterId}:${user.id}`} player={user} />;
  };

  return (
    <>
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        <HStack w="full">
          <VStack
            // maxH='480px' overflowY='scroll'
            w="full"
          >
            {chapters?.map((chapter, index) => {
              const assignment = map.get(chapter?.index);
              const isAssigned = assignment && !!assignment.user;
              return (
                <HStack key={chapter?.index} w="full">
                  <HStack
                    alignItems="center"
                    bg="teal.100"
                    // bg={map.get(chapter?.index) ? "teal.200" : "teal.100"}
                    opacity={map.get(chapter?.index) ? 1 : 0.5}
                    borderRadius="md"
                    // opacity={map.get(chapter?.index) ? 1 : 0.3}
                    p={2}
                    w="full"
                  >
                    <Box>
                      <HStack>
                        <Image
                          w="40px"
                          h="40px"
                          src={presentImages[index]}
                          borderRadius="xl"
                          alt=""
                        />
                        <Box>
                          <Text fontSize="sm">{chapter?.index}</Text>
                          <Text
                            fontWeight="bold"
                            css={{
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {chapter?.title}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  </HStack>
                  <Droppable
                    chapter={chapter}
                    id={chapter?.index}
                    isAssigned={isAssigned}
                    onClick={removeAssign}
                  >
                    <AssignedPlayer chapterId={chapter?.index} />
                  </Droppable>
                </HStack>
              );
            })}
          </VStack>
          <VStack alignSelf="flex-start" display={hideSM} w="40%">
            {players.map((user) => (
              <Player id={user.userId} key={user.userId} player={user} />
            ))}
          </VStack>
        </HStack>
      </DndContext>
    </>
  );
};

export default Assign;

const findUserById = (userId, players) => {
  return players.find((player) => player.userId === userId);
};

function Droppable({ id, isAssigned, children, onClick, chapter }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });
  const style = {
    borderColor: isOver ? "teal" : undefined,
  };

  return (
    <Box
      _hover={{
        borderColor: "gray.500",
      }}
      alignItems="center"
      display={{ base: "none", md: "flex" }}
      minH={16}
      bg={isOver ? "teal.100" : "gray.200"}
      position="relative"
      ref={setNodeRef}
      rounded="md"
      style={style}
      w="full"
    >
      {children}
    </Box>
  );
}

const Player = ({ id, player }) => (
  <Draggable id={id}>
    <HStack h={16}>
      <Flex h={10} w={10}>
        <Image
          alt={player.displayName}
          height="40px"
          src={player.photoUrl}
          width="40px"
          style={{ borderRadius: "8px" }}
        />
      </Flex>
      <Box>
        <Text fontWeight="bold">{player.displayName}</Text>
        <Text fontSize="xs" fontWeight="bold" color="gray.500">
          @{player.userId}
        </Text>
      </Box>
    </HStack>
  </Draggable>
);
function Draggable({ id, children, onClick }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <Box
      _hover={{
        border: "1px solid rgba( 255, 255, 255, 0.25 )",
      }}
      bg="gray.200"
      border="1px solid black"
      borderColor="gray.300"
      px={4}
      ref={setNodeRef}
      rounded="md"
      style={style}
      w="full"
      {...listeners}
      {...attributes}
    >
      {children}
    </Box>
  );
}

const saveGroupChapter = async (groupId, map) => {
  // 新しい配列を作成して各エントリを変換する
  const groupChapters = Array.from(map.entries())
    .map(([chapterId, { user, chapter }]) => {
      if (!user || !chapter) return;

      return {
        assignId: user.userId,
        index: chapterId,
        title: chapter.title,
        isCompleted: false,
      };
    })
    .filter((chapter) => chapter !== undefined);

  // データベースに保存
};

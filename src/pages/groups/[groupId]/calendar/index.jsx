import { Box, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import { Calendar as BigCalendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = dayjsLocalizer(dayjs);

const Calendar = () => {
  const formats = {
    monthHeaderFormat: "M月",
    dayFormat: "D",
    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
      `${dayjs(start).format("M月")}`,
    dayHeaderFormat: "YYYY-MM-DD", // 1日のビューのヘッダーフォーマット
    dateFormat: "D",
  };
  return (
    <>
      <Flex
        w="100%"
        h="40px"
        borderBottom="0.3px solid black"
        borderColor="gray.200"
        alignItems="center"
        px={4}
      >
        <HStack spacing={4}>
          <Icon w="20px" h="20px" as={AiOutlineCalendar} />
          <Text fontWeight="bold">Calendar</Text>
        </HStack>
      </Flex>
      <Box
        style={{ height: "calc(100vh - 152px)" }}
        overflowY="auto"
        my="16px"
        mx="16px"
      >
        <BigCalendar
          localizer={localizer}
          formats={formats}
          // events={myEventsList}
          startAccessor="start"
          endAccessor="end"
          className="my-custom-calendar"
        />
      </Box>
    </>
  );
};

export default Calendar;

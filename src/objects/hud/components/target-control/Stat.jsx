import React from "react";

import { Text, Box, Flex } from "pizza-juice";

import { Neutral } from "./icon/Neutral.jsx";

export const Stat = ({ label, value }) => {
  return (
    <Flex direction="column" gap={1}>
      <Flex align="center" justify="between" css={{ flex: 1 }}>
        <Text size="sm" weight="medium" css={{ color: "$grey-400", w: "22px" }}>
          {label}
        </Text>

        <Box css={{ color: "$grey-700" }}>
          <Neutral width="9" />
        </Box>

        <Text weight="medium" size="sm" textAlign="right">
          {value}
        </Text>
      </Flex>

      <Box css={{ h: 1, w: "$full", bg: "$grey-700" }} />
    </Flex>
  );
};

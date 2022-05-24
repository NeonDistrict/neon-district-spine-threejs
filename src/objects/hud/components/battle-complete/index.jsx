import { Box, Text } from "pizza-juice";
import React from "react";
import { BattleEndTitle } from "./styles";

export const BattleComplete = ({ winner }) => {
  const winnerText = winner === "one" ? "YOU WIN" : "YOU LOSE";

  return (
    <Box
      css={{
        position: "absolute"
      }}
    >
      <Text>GAME OVER</Text>
      <BattleEndTitle win={winner === "one"}>{winnerText}</BattleEndTitle>
    </Box>
  );
};

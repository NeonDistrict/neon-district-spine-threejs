import { Button, Stack, Text } from "pizza-juice";
import React from "react";
import { BattleEndContainer, BattleEndTitle } from "./styles";

export const BattleComplete = ({ winner, owner }) => {
  const { isOwner } = owner[winner];
  const winnerText = winner === "one" ? "YOU WON" : "YOU LOSE";

  return (
    <BattleEndContainer>
      <Text css={{ mb: "$2" }}>GAME OVER</Text>
      <BattleEndTitle
        as="p"
        weight="bold"
        textAlign="center"
        win={isOwner}
        css={{
          fontSize: "4.5rem"
        }}
      >
        {winnerText}
      </BattleEndTitle>
      <Stack>
        <Button as="a" variant="outlined">
          Play Again
        </Button>
        <Button>Back to Dashboard</Button>
      </Stack>
    </BattleEndContainer>
  );
};

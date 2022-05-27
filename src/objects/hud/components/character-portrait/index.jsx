import React from "react";

import { Text, Image, Box } from "pizza-juice";
import * as S from "./styles";

export const CharacterPortrait = ({ character, active, enemy }) => {
  const emptyCharacterImg =
    "https://neon-district-cdn.s3.amazonaws.com/empty-state/no-character.png";

  const tick = character && character.tick;
  const src = character && character.headImgSrc;

  return (
    <Box
      css={{
        ...(enemy && { transform: "scaleX(-1)" })
      }}
    >
      <S.Wrapper active={active} enemy={enemy}>
        <Image src={src || emptyCharacterImg} css={{}} />

        <S.Overlay>
          <S.Top>
            <Text weight="medium">{tick || 0}</Text>
          </S.Top>
        </S.Overlay>
      </S.Wrapper>

      <S.Below enemy={enemy} />
    </Box>
  );
};

import React from "react";

import { Text, Image } from "pizza-juice";
import * as S from "./styles";

export const CharacterPortrait = ({ character, active, enemy }) => {
  const emptyCharacterImg =
    "https://neon-district-cdn.s3.amazonaws.com/empty-state/no-character.png";

  const tick = character && character.tick;
  const src = character && character.headImgSrc;

  return (
    <S.Wrapper active={active} enemy={enemy}>
      <Image
        src={src || emptyCharacterImg}
        css={{
          h: 80,
          ...(enemy && { transform: "scaleX(-1)" })
        }}
      />

      <S.Overlay>
        <S.Top>
          <Text weight="medium" size="lg">
            {tick || 0}
          </Text>
        </S.Top>
      </S.Overlay>
    </S.Wrapper>
  );
};

import React from "react";

import * as S from "./styles";

import { Image } from "pizza-juice";

export const Character = ({ active = false, character, enemy }) => {
  const emptyCharacterImg =
    "https://neon-district-cdn.s3.amazonaws.com/empty-state/no-character.png";

  // FIXME: Connect character data to this component
  const type = false;

  const emptyMessage = enemy ? "Select your target" : "Empty";

  return (
    <S.Wrapper active={active}>
      <Image
        src={emptyCharacterImg}
        alt={emptyMessage}
        css={{
          h: 198,
          ...(enemy && { transform: "scaleX(-1)" }),
          filter: "brightness(25%)"
        }}
      />

      <S.Overlay>
        <S.Top>
          <S.Typename>{type || emptyMessage}</S.Typename>
        </S.Top>
      </S.Overlay>
    </S.Wrapper>
  );
};

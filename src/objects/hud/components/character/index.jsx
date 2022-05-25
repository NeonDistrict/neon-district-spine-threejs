import React from "react";

import * as S from "./styles";

import { Image } from "pizza-juice";

export const Character = ({
  active = false,
  character,
  enemy,
  size = 198,
  css
}) => {
  const emptyCharacterImg =
    "https://neon-district-cdn.s3.amazonaws.com/empty-state/no-character.png";

  // FIXME: Connect character data to this component
  const type = character && character.type;

  const emptyMessage = enemy ? "Select your target" : "Empty";

  return (
    <S.Wrapper active={active} css={css}>
      <Image
        // FIXME: add .? later
        src={(character && character.headImgSrc) || emptyCharacterImg}
        alt={(character && character.name) || emptyMessage}
        css={{
          h: size,
          filter: "brightness(33%)",
          ...(enemy && { transform: "scaleX(-1)" })
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

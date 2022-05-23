import React from "react";

import * as S from "./styles";

import { Image } from "pizza-juice";

export const Character = ({ active, character }) => {
  const emptyCharacterImg =
    "https://neon-district-cdn.s3.amazonaws.com/empty-state/no-character.png";

  const type = character.type || "genius";

  return (
    <S.Wrapper active={active}>
      <Image
        src={character.headImgSrc || emptyCharacterImg}
        alt={character.name || "Empty"}
        css={{ w: "$full" }}
      />

      <S.Overlay>
        <S.Top>
          <S.Typename empty={!!type}>{type || "Empty"}</S.Typename>
        </S.Top>
      </S.Overlay>
    </S.Wrapper>
  );
};

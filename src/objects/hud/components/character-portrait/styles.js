import { styled } from "pizza-juice";

export const Wrapper = styled("div", {
  position: "relative",
  bg: "$grey-900",

  variants: {
    active: {
      true: {
        bs: "inset 0 0 0 1px $$baseColor"
      },
      false: {
        bs: "inset 0 0 0 1px $grey-900"
      }
    },
    enemy: {
      true: { $$baseColor: "$colors$red-500" },
      false: {
        $$baseColor: "$colors$green-500"
      }
    }
  }
});

export const Overlay = styled("div", {
  position: "absolute",
  top: 0,

  size: "$full",
  d: "flex",
  flexDirection: "column",
  justify: "space-between"
});

export const Top = styled("div", {
  d: "flex",
  flexDirection: "column",

  px: "$1"
});

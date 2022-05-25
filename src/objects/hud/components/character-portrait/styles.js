import { styled } from "pizza-juice";

export const Wrapper = styled("div", {
  d: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",

  size: 74,

  bg: "rgba(0, 0, 0, 0.77)",

  variants: {
    active: {
      true: {
        border: "2px solid $$baseColor"
      },
      false: {
        border: "2px solid $grey-900"
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

export const Below = styled("div", {
  w: 16,
  h: 5,
  bg: "$$baseColor",

  // TODO: damn, diagonal lines in CSS is hard huh?
  variants: {
    enemy: {
      true: { $$baseColor: "$colors$red-500" },
      false: {
        $$baseColor: "$colors$green-500"
      }
    }
  }
});

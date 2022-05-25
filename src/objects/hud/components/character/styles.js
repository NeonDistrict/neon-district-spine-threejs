import { styled } from "pizza-juice";

export const Wrapper = styled("div", {
  position: "relative",

  /**
   * Variants
   */
  variants: {
    /**
     * Active variant
     */
    active: {
      true: {
        bs: "0 0 0 1px $colors$pink-500"
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

  p: "$3",
  pb: "0"
});

export const Center = styled("div", {
  d: "flex",
  justify: "center",
  align: "center",
  px: "$3"
});

export const Bottom = styled("div", {
  d: "flex",
  justify: "flex-end",

  p: "$3",
  pt: "0"
});

export const Typename = styled("div", {
  maxW: "66%",

  fontWeight: "$medium",
  color: "$pink-500",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "$white",
  fontSize: "$md",
  lineHeight: "24px"
});

export const Info = styled("span", {
  fontSize: "$sm",
  fontWeight: "$medium",
  color: "$white",
  lineHeight: "24px",
  letterSpacing: "0.05em",
  textTransform: "uppercase"
});

export const Index = styled("div", {
  d: "flex",
  justify: "center",
  align: "center",
  bg: "$pink-500",
  color: "$white",
  fontWeight: "$medium",
  userSelect: "none",

  fontSize: "$md",
  lineHeight: 24,
  size: 32
});

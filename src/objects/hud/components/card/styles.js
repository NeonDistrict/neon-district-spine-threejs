import { styled } from "pizza-juice";

export const Wrapper = styled("div", {
  d: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  bg: "$grey-900",

  size: 194,
  p: "$4",

  $$color: "#E9323A",

  boxShadow: "inset 0px 0px 0px 2px $$color",

  variants: {
    variant: {
      attack: {
        $$color: "#E9323A"
      },
      ability: {
        $$color: "#66BA93"
      },
      effect: {
        $$color: "#EFD372"
      },
      interact: {
        $$color: "#83F4E1"
      }
    },

    selected: {
      true: {
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"
      },
      false: {}
    }
  }
});

import { styled } from "pizza-juice";

export const Wrapper = styled("div", {
  d: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  bg: "$grey-900",

  w: 198,
  p: "$4",

  $$innerBorder: "inset 0px 0px 0px 2px rgb($$color)",
  boxShadow: "$$innerBorder",

  transition: "all 0.33s ease-in-out",

  variants: {
    variant: {
      attack: {
        $$color: "233, 50, 58"
      },
      ability: {
        $$color: "102, 186, 147"
      },
      effect: {
        $$color: "239, 211, 114"
      },
      interact: {
        $$color: "131, 244, 225"
      }
    },

    selected: {
      true: {
        boxShadow: "$$innerBorder, 0px 4px 38px 20px rgba($$color, 0.25)"
      },
      false: {}
    }
  }
});

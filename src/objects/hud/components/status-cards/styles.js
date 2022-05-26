import { Box, styled } from "pizza-juice";

export const StatusWrapper = styled(Box, {
  fontSize: "$md",
  textAlign: "center",
  py: "$1",
  px: "$2",
  fontFamily: "'Titillium Web', sans-serif",
  opacity: "0.8",
  animation: "fadeIn 0.5s ease-in-out",
  "-webkit-animation": "fadeIn 0.5s ease-in-out",
  "-moz-animation": "fadeIn 0.5s ease-in-out",
  "-o-animation": "fadeIn 0.5s ease-in-out",
  "-ms-animation": "fadeIn 0.5s ease-in-out",

  variants: {
    status: {
      ticks: {
        background: "$yellow-900",
        border: "1px solid $yellow-500",
        color: "$yellow-500"
      },
      positive: {
        background: "$green-900",
        border: "1px solid $green-500",
        color: "$green-500"
      },
      negative: {
        background: "$red-900",
        border: "1px solid $red-500",
        color: "$red-500"
      }
    }
  }
});

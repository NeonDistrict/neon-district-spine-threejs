import { Box, styled, Text } from "pizza-juice";

export const BattleEndContainer = styled(Box, {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  background: "rgba(0,0,0,0.7)",
  width: "100%",
  height: "100%",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 8,
  textAlign: "center",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(8.5px)",
  "-webkit-backdrop-filter": "blur(8.5px)"
});

export const BattleEndTitle = styled(Text, {
  mb: "$4",

  variants: {
    win: {
      true: {
        color: "$green-500"
      },
      false: {
        color: "$red-500"
      }
    }
  }
});

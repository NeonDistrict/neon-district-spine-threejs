import { styled, Text } from "pizza-juice";

export const BattleEndTitle = styled(Text, {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#fff",
  textAlign: "center",

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

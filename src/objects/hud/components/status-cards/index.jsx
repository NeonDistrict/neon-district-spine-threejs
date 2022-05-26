import React from "react";
import { StatusWrapper } from "./styles";

export const StatusCard = ({ children, type = "ticks" }) => {
  return <StatusWrapper status={type}>{children}</StatusWrapper>;
};

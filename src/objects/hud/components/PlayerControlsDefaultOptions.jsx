import React from "react";
import { HUDComponent } from "../core/HUDComponent.jsx";

import { Flex, Divider, Text, Box } from "pizza-juice";
import * as S from "./card/styles.js";

export class PlayerControlsDefaultOptions extends HUDComponent {
  render() {
    console.log("** Rendering the Player Controls Default Options **");

    return (
      <S.Wrapper
        variant="attack"
        onClick={this.props.callback}
        selected={this.props.selected}
      >
        <Flex direction="column" gap={1}>
          <Text size="sm" weight="medium">
            Base Attack
          </Text>
          <Divider css={{ $$color: "$colors$white" }} />
        </Flex>

        <Flex justify="between">
          <Text>Attack</Text>
          <Box css={{ br: "$full", bg: "$grey-700", p: "$1" }}>
            <Text size="xs">40</Text>
          </Box>
        </Flex>
      </S.Wrapper>
    );
  }
}

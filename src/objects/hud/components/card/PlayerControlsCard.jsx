import React from "react";
import { HUDComponent } from "../../core/HUDComponent.jsx";
import lstyle from "../../../../styles/hud.scss";

import { Text, Box, Flex, Divider, Image } from "pizza-juice";
import * as S from "./styles";

export class PlayerControlsCard extends HUDComponent {
  isValidCard(card) {
    return (
      card &&
      card.type &&
      ["attack", "ability", "effect", "interact"].indexOf(
        card.type.toLowerCase()
      ) >= 0
    );
  }

  render() {
    console.log("** Rendering the Player Controls Card **");

    let styles = [lstyle.card];

    if (this.hudLocked) {
      return (
        <Flex
          align="center"
          justify="center"
          css={{
            size: 194,
            bg: "$grey-900",
            // FIXME: It should be inner shadow.
            border: "2px solid",
            borderImage: "linear-gradient(74.28deg, #11EEF1, #F70835) 1"
          }}
        >
          <Image
            src="https://cdn.discordapp.com/attachments/915271999843074109/976934304980541450/Vector_1.png"
            css={{ w: 120, h: 64 }}
          />
        </Flex>
      );
    }

    let card = this.props.card;

    if (!this.isValidCard(card)) {
      // Get the specific card type for styles
      styles.push(lstyle.fillerCard);

      // TODO: Design for missing card
      return (
        <div className={lstyle.cardSelectionWrapper}>
          <div className={styles.join(" ")}>
            <h3 className={lstyle.cardTitle}>Empty Card Slot</h3>
            <p>Missing Weapon Equipment</p>
          </div>
        </div>
      );
    }

    // Get the specific card type for styles
    styles.push(lstyle[card.type.toLowerCase() + "Card"]);

    // Disallow selecting certain types
    let disallowSelect =
      ["interact", "effect"].indexOf(card.type.toLowerCase()) !== -1;

    return (
      // TODO: Design for replace card
      <S.Wrapper
        variant={card.type.toLowerCase()}
        selected={this.props.selected}
        onClick={disallowSelect ? () => {} : this.props.callback}
      >
        <Flex direction="column" gap={1}>
          <Text size="sm" weight="medium">
            {card.name}
          </Text>
          <Divider css={{ $$color: "$colors$white" }} />
          <Text size="sm" transform="normal" css={{ color: "$grey-400" }}>
            {card.effects}
          </Text>
          {card.exploits && (
            <Text size="sm" transform="normal" css={{ color: "$pink-500" }}>
              {card.exploits}
            </Text>
          )}
        </Flex>
        <Flex justify="between">
          <Text>{card.type}</Text>
          <Box css={{ br: "$full", bg: "$grey-700", p: "$1" }}>
            <Text size="xs">{card.tickCost}</Text>
          </Box>
        </Flex>
      </S.Wrapper>
    );
  }
}

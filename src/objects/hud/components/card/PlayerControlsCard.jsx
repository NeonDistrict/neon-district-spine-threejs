import React from "react";
import { HUDComponent } from "../../core/HUDComponent.jsx";
import lstyle from "../../../../styles/hud.scss";

import { AttackIcon } from "./icon/AttackIcon.jsx";
import { InteractIcon } from "./icon/InteractIcon.jsx";
import { AbilityIcon } from "./icon/AbilityIcon.jsx";
import { EffectIcon } from "./icon/EffectIcon.jsx";

import { NdLogo } from "./icon/NdLogo.jsx";

import { Text, Box, Flex, Divider, Button } from "pizza-juice";

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

    const card = this.props.card;

    const iconMap = {
      attack: <AttackIcon />,
      interact: <InteractIcon />,
      ability: <AbilityIcon />,
      effect: <EffectIcon />
    };

    let styles = [lstyle.card];

    if (!this.props.baseAttack && this.hudLocked) {
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
          <NdLogo />
        </Flex>
      );
    }

    const cardType = card.type.toLowerCase();

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

    // Disallow selecting certain types
    let disallowSelect = ["interact", "effect"].indexOf(cardType) !== -1;

    return (
      <S.Wrapper
        variant={cardType}
        selected={this.props.selected}
        onClick={disallowSelect ? () => {} : this.props.callback}
      >
        <Flex direction="column" gap={1}>
          <Text size="sm" weight="medium">
            {card.name}
          </Text>
          <Divider css={{ $$color: "$colors$white" }} />

          <Flex direction="column" gap={2}>
            <Text size="sm" transform="normal" css={{ color: "$grey-400" }}>
              {card.effects}
            </Text>
            {card.exploits && (
              <Text size="sm" transform="normal" css={{ color: "$pink-500" }}>
                {card.exploits}
              </Text>
            )}
            {/* TODO: Figma Design for replace card */}
            {card.replace && (
              <Button
                onClick={this.props.replaceCallback}
                css={{ alignSelf: "center" }}
              >
                Replace
              </Button>
            )}
          </Flex>
        </Flex>

        <Flex justify="between" align="center">
          <Flex gap={2} align="center">
            {iconMap[cardType]}
            <Text size="sm" weight="medium">
              {cardType}
            </Text>
          </Flex>
          <Box css={{ br: "$full", bg: "$grey-700", p: "$1" }}>
            <Text size="xs" weight="medium">
              {card.tickCost}
            </Text>
          </Box>
        </Flex>
      </S.Wrapper>
    );
  }
}

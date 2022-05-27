import React from "react";

import { BattleComplete } from "./components/battle-complete/index.jsx";
import { PlayerControlsCard } from "./components/card/PlayerControlsCard.jsx";
import { PlayerControlsCharacter } from "./components/player-control/PlayerControlsCharacter.jsx";
import { TargetCharacterControls } from "./components/target-control/TargetCharacterControls.jsx";
import { HUDComponent } from "./core/HUDComponent.jsx";

import { Box, Flex, Text } from "pizza-juice";
export class PlayerControlsDisplay extends HUDComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedAction: null,
      selectedTarget: null,
      activeCharacter: null,
      battleComplete: false,
      winner: null,
      owner: null
    };

    this.confirmAction = props.confirmAction;

    window.addEventListener("battleComplete", ({ detail }) => {
      this.setState({
        battleComplete: true,
        winner: detail.winner,
        owner: detail.owner
      });
    });
  }

  chooseOption(option) {
    if (this.state.selectedAction !== option) {
      if (
        this.props.playerSelections &&
        this.props.playerSelections.validateActionSelect(option)
      ) {
        this.props.playerSelections.setAction(option);
      }
      this.setState({ selectedAction: option });
    }
  }

  chooseReplaceOption(target) {
    // Remove visuals
    this.setState({ selectedAction: null, selectedAction: null });

    // Select replace and the correct card target
    if (
      this.props.playerSelections &&
      this.props.playerSelections.validateActionSelect("replace")
    ) {
      this.props.playerSelections.setAction("replace");

      if (
        this.props.playerSelections &&
        this.props.playerSelections.validateTargetSelect(target)
      ) {
        this.props.playerSelections.setTarget(target);

        // Submit the action
        this.confirmAction();
      }
    }
  }

  chooseTarget(option) {
    if (
      this.props.playerSelections &&
      this.props.playerSelections.validateTargetSelect(option)
    ) {
      this.props.playerSelections.setTarget(option);
      this.setState({ selectedTarget: option });
    }
  }

  confirmActionCapture() {
    this.setState({ selectedAction: null, selectedAction: null });
    this.confirmAction();
  }

  render() {
    console.log("** Rendering the Player Controls Display **");

    let activeCharacter = this.getActivePlayer();
    let targetCharacter = this.getTarget();

    return (
      <Flex
        // className={lstyle.playerControlsWrapper}
        align="center"
        gap={4}
        css={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          w: "$full"
        }}
      >
        {this.state.battleComplete && (
          <BattleComplete winner={this.state.winner} owner={this.state.owner} />
        )}
        <Flex
          direction="column"
          gap={2}
          css={{
            bg: "rgba(14, 14, 14, 0.8)",
            pt: "$4",
            pb: "$6",
            px: "$4"
          }}
        >
          {/* Top Border */}
          <Text weight="medium" css={{ color: "$pink-500" }}>
            Player
          </Text>

          <Box>
            <Box css={{ h: 1, w: "$full", bg: "$grey-700" }} />
            <Box css={{ h: 2, w: "18%", bg: "$grey-700" }} />
          </Box>

          {/* Middle Panel */}
          <Flex gap={1} css={{ h: 198, w: "$full" }}>
            {/* Player Profile */}
            <PlayerControlsCharacter
              character={activeCharacter}
              isTarget={false}
            />

            {/* Attack, and eventually, Interact */}
            <PlayerControlsCard
              card={{
                name: "Base Attack",
                type: "ATTACK",
                tickCost: 40
              }}
              callback={this.chooseOption.bind(this, "attack")}
              selected={this.state.selectedAction === "attack"}
              baseAttack
            />

            {/* Cards */}
            <PlayerControlsCard
              card={
                (this.props.playerSelections &&
                  this.props.playerSelections.getCard(0)) ||
                {}
              }
              callback={this.chooseOption.bind(this, "card0")}
              replaceCallback={this.chooseReplaceOption.bind(this, "card0")}
              selected={this.state.selectedAction === "card0"}
            />

            <PlayerControlsCard
              card={
                (this.props.playerSelections &&
                  this.props.playerSelections.getCard(1)) ||
                {}
              }
              callback={this.chooseOption.bind(this, "card1")}
              replaceCallback={this.chooseReplaceOption.bind(this, "card1")}
              selected={this.state.selectedAction === "card1"}
            />

            <PlayerControlsCard
              card={
                (this.props.playerSelections &&
                  this.props.playerSelections.getCard(2)) ||
                {}
              }
              callback={this.chooseOption.bind(this, "card2")}
              replaceCallback={this.chooseReplaceOption.bind(this, "card2")}
              selected={this.state.selectedAction === "card2"}
            />
          </Flex>
        </Flex>

        <Flex
          direction="column"
          gap={2}
          css={{
            w: "33%",
            bg: "rgba(14, 14, 14, 0.8)",
            pt: "$4",
            pb: "$6",
            px: "$4"
          }}
        >
          <Text weight="medium" css={{ color: "$pink-500" }}>
            {targetCharacter ? "Target" : "Select your Target"}
          </Text>

          <Box>
            <Box css={{ h: 1, w: "$full", bg: "$grey-700" }} />
            <Box css={{ h: 2, w: "18%", bg: "$grey-700" }} />
          </Box>

          <TargetCharacterControls
            activeAnimEvt={this.props.activeAnimEvt}
            targetCharacter={targetCharacter}
            confirmCallback={this.confirmActionCapture.bind(this)}
          />
        </Flex>
      </Flex>
    );
  }
}

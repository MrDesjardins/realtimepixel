import { Component, createSignal } from "solid-js";
import styles from "./App.module.css";
import { AppControls } from "./containers/AppControls/AppControls";
import { UserControls } from "./containers/AppControls/UserControls";
import { UserHelps } from "./containers/AppControls/UserHelps";
import { AppGame } from "./containers/AppGame/AppGame";
import { GameBoardContainer } from "./containers/AppGame/GameBoardContainer";
import { PixelSelector } from "./containers/AppGame/PixelSelector";
import { PositionContainer } from "./containers/AppGame/PositionContainer";
import { ZoomContainer } from "./containers/AppGame/ZoomContainer";
import { ControlContext, ControlProvider } from "./context/ControlContext";
import { CONSTS } from "./models/constants";
import { Zoom } from "./models/enums";
import { Coordinate } from "./models/game";

export const App: Component = () => {
  return (
    <div class={styles.App}>
      <ControlProvider>
        <AppGame>
          <PositionContainer>
            <ZoomContainer>
              <PixelSelector
                onPixelSelected={(coord) => {
                  console.log("Acquire the pixel");
                }}
              >
                <GameBoardContainer />
              </PixelSelector>
            </ZoomContainer>
          </PositionContainer>
        </AppGame>
        <AppControls>
          <UserControls />
          <UserHelps />
        </AppControls>
      </ControlProvider>
    </div>
  );
};

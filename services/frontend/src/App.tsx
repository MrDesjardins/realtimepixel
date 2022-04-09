import { Component } from "solid-js";
import styles from "./App.module.css";
import { AppControls } from "./containers/AppControls/AppControls";
import { UserControls } from "./containers/AppControls/UserControls";
import { UserHelps } from "./containers/AppControls/UserHelps";
import { AppGame } from "./containers/AppGame/AppGame";
import { GameBoardContainer } from "./containers/AppGame/GameBoardContainer";
import { HeadOverDisplay } from "./containers/AppGame/HeadOverDisplay";
import { PixelSelector } from "./containers/AppGame/PixelSelector";
import { PositionContainer } from "./containers/AppGame/PositionContainer";
import { ZoomContainer } from "./containers/AppGame/ZoomContainer";
import { ControlProvider } from "./context/ControlContext";

export const App: Component = () => {
  return (
    <div class={styles.App}>
      <ControlProvider>
        <AppGame>
          <HeadOverDisplay />
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

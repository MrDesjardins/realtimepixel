import { Component, createSignal } from "solid-js";
import styles from "./App.module.css";
import { AppControls } from "./containers/AppControls/AppControls";
import { UserControls } from "./containers/AppControls/UserControls";
import { UserHelps } from "./containers/AppControls/UserHelps";
import { AppGame } from "./containers/AppGame/AppGame";
import { GameBoardContainer } from "./containers/AppGame/GameBoardContainer";
import { PositionContainer } from "./containers/AppGame/PositionContainer";
import { ZoomContainer } from "./containers/AppGame/ZoomContainer";
import { ControlContext, ControlProvider } from "./context/ControlContext";
import { CONSTS } from "./models/constants";
import { Zoom } from "./models/enums";
import { Coordinate } from "./models/game";


export const App: Component = () => {
  const [coord, setCoord] = createSignal({ x: 0, y: 0 });
  const [zoomValue, setZoomValue] = createSignal(1);
  return (
    <div class={styles.App}>
      <ControlProvider>
        <AppGame
          onPanning={(c: Coordinate) => {
            setCoord(c);
          }}
          onZoom={(zoom: Zoom) => {
            let newValue =
              zoom === Zoom.In
                ? zoomValue() + CONSTS.gameBoard.zoomStep
                : zoomValue() - CONSTS.gameBoard.zoomStep;
            if (newValue < 0) {
              newValue = CONSTS.gameBoard.minimumZoom;
            } else if (newValue > CONSTS.gameBoard.maximumZoom) {
              newValue = CONSTS.gameBoard.maximumZoom;
            }
            setZoomValue(newValue);
          }}
        >
          <PositionContainer coordinate={coord()}>
            <ZoomContainer zoomValue={zoomValue()}>
              <GameBoardContainer />
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

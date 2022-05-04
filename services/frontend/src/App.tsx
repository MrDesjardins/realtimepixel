import { Component } from "solid-js";
import styles from "./App.module.css";
import { ToastNotification } from "./components/ToastNotification/ToastNotification";
import { AppControls } from "./containers/AppControls/AppControls";
import { AppGame } from "./containers/AppGame/AppGame";
import { GameBoardContainer } from "./containers/AppGame/GameBoardContainer";
import { HeadOverDisplay } from "./containers/AppGame/HeadOverDisplay";
import { PixelSelector } from "./containers/AppGame/PixelSelector";
import { PositionContainer } from "./containers/AppGame/PositionContainer";
import { ZoomContainer } from "./containers/AppGame/ZoomContainer";
import { HelpContainer } from "./containers/FloatingControls/HelpContainer";
import { ControlProvider } from "./context/ControlContext";
import { NotificationProvider } from "./context/NotificationContext";
import { UserDataProvider } from "./context/UserDataContext";

export const App: Component = () => {
  return (
    <div class={styles.App}>
      <NotificationProvider>
        <UserDataProvider>
          <ControlProvider>
            <ToastNotification />
            <HelpContainer />
            <AppGame>
              <HeadOverDisplay />
              <PositionContainer>
                <ZoomContainer>
                  <PixelSelector>
                    <GameBoardContainer />
                  </PixelSelector>
                </ZoomContainer>
              </PositionContainer>
            </AppGame>
            <AppControls />
          </ControlProvider>
        </UserDataProvider>
      </NotificationProvider>
    </div>
  );
};

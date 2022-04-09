import { createEffect, createSignal, JSX } from "solid-js";
import { useUserData } from "../../context/UserDataContext";
import { CONSTS } from "../../models/constants";
import { Zoom } from "../../models/enums";
import styles from "./ZoomContainer.module.css";
export interface ZoomContainerProps {
  children: JSX.Element;
}
export function ZoomContainer(props: ZoomContainerProps): JSX.Element {
  const userData = useUserData();
  return (
    <div
      className={styles.ZoomContainer}
      style={{
        transform: `scale(${userData?.zoom()})`,
      }}
      onWheel={(e) => {
        const direction = e.deltaY < 0 ? Zoom.In : Zoom.Out;
        let newValue =
          direction === Zoom.In
            ? (userData?.zoom() ?? 1) + CONSTS.gameBoard.zoomStep
            : (userData?.zoom() ?? 1) - CONSTS.gameBoard.zoomStep;
        if (newValue < CONSTS.gameBoard.minimumZoom) {
          newValue = CONSTS.gameBoard.minimumZoom;
        } else if (newValue > CONSTS.gameBoard.maximumZoom) {
          newValue = CONSTS.gameBoard.maximumZoom;
        }
        userData?.setZoom(newValue);
      }}
    >
      {props.children}
    </div>
  );
}

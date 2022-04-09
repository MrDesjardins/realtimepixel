import { createEffect, createSignal, JSX } from "solid-js";
import { CONSTS } from "../../models/constants";
import { Zoom } from "../../models/enums";
import styles from "./ZoomContainer.module.css";
export interface ZoomContainerProps {
  children: JSX.Element;
}
export function ZoomContainer(props: ZoomContainerProps): JSX.Element {
  const [scaling, setScaling] = createSignal(1);

  return (
    <div
      className={styles.ZoomContainer}
      style={{
        transform: `scale(${scaling()})`,
      }}
      onWheel={(e) => {
        const direction = e.deltaY < 0 ? Zoom.In : Zoom.Out;
        let newValue =
          direction === Zoom.In
            ? scaling() + CONSTS.gameBoard.zoomStep
            : scaling() - CONSTS.gameBoard.zoomStep;
        if (newValue < CONSTS.gameBoard.minimumZoom) {
          newValue = CONSTS.gameBoard.minimumZoom;
        } else if (newValue > CONSTS.gameBoard.maximumZoom) {
          newValue = CONSTS.gameBoard.maximumZoom;
        }
        setScaling(newValue);
      }}
    >
      {props.children}
    </div>
  );
}

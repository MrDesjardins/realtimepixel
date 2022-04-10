import { createEffect, createMemo, createSignal, JSX } from "solid-js";
import { CONSTS } from "../../models/constants";
import { Coordinate } from "../../models/game";
import styles from "./TargetSelector.module.css";
export interface TargetSelectorProps {
  display: boolean;
  coordinate: Coordinate;
}
export function TargetSelector(props: TargetSelectorProps): JSX.Element {
  const coordinateAdjusted = createMemo(() => {
    const adjusted = getClosestPixel(props.coordinate);
    adjusted.x -= CONSTS.gameBoard.borderTarget;
    adjusted.y -= CONSTS.gameBoard.borderTarget;
    return adjusted;
  });

  return (
    <div
      class={styles.TargetSelector}
      style={{
        left: `${coordinateAdjusted().x}px`,
        top: `${coordinateAdjusted().y}px`,
        // visibility: props.display ? "visible" : "hidden",
        width: `${CONSTS.gameBoard.pixelSize}px`,
        height: `${CONSTS.gameBoard.pixelSize}px`,
        border: `${CONSTS.gameBoard.borderTarget}px solid red`,
      }}
    ></div>
  );
}

export function getClosestPixel(coordinate: Coordinate): Coordinate {
  const x =
    Math.floor(coordinate.x / CONSTS.gameBoard.pixelSize) *
    CONSTS.gameBoard.pixelSize;
  const y =
    Math.floor(coordinate.y / CONSTS.gameBoard.pixelSize) *
    CONSTS.gameBoard.pixelSize;
  return { x, y };
}

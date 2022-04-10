import { createMemo, JSX } from "solid-js";
import { getClosestPixel } from "../../logics/pixel";
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


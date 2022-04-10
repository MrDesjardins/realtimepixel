import { createMemo, JSX } from "solid-js";
import { useUserData } from "../../context/UserDataContext";
import { getClosestPixel } from "../../logics/pixel";
import { CONSTS } from "../../models/constants";
import { Coordinate } from "../../models/game";
import styles from "./TargetSelector.module.css";
export interface TargetSelectorProps {}
export function TargetSelector(props: TargetSelectorProps): JSX.Element {
  const userData = useUserData();
  
  const coordinateAdjusted = createMemo(() => {
    console.log("target", userData?.coordinate());
    const adjusted = getClosestPixel(userData?.coordinate() ?? { x: 0, y: 0 });
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

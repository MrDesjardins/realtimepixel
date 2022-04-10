import { createMemo, JSX } from "solid-js";
import { useUserData } from "../../context/UserDataContext";
import { getClosestPixel } from "../../logics/pixel";
import { CONSTS } from "../../models/constants";
import styles from "./TargetSelector.module.css";
export interface TargetSelectorProps {}
export function TargetSelector(props: TargetSelectorProps): JSX.Element {
  const userData = useUserData();
  
  const coordinateAdjusted = createMemo(() => {
    const adjusted = getClosestPixel(userData?.coordinate() ?? { x: 0, y: 0 });
    adjusted.x -= CONSTS.gameBoard.borderTargetPx;
    adjusted.y -= CONSTS.gameBoard.borderTargetPx;
    return adjusted;
  });

  return (
    <div
      class={styles.TargetSelector}
      style={{
        left: `${coordinateAdjusted().x}px`,
        top: `${coordinateAdjusted().y}px`,
        width: `${CONSTS.gameBoard.pixelSizePx}px`,
        height: `${CONSTS.gameBoard.pixelSizePx}px`,
        border: `${CONSTS.gameBoard.borderTargetPx}px solid red`,
      }}
    ></div>
  );
}

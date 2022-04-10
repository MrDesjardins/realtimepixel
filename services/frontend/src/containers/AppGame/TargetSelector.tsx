import { createMemo, JSX, Show } from "solid-js";
import { useUserData } from "../../context/UserDataContext";
import { getClosestPixel } from "../../logics/pixel";
import { CONSTS } from "../../models/constants";
import styles from "./TargetSelector.module.css";
export interface TargetSelectorProps {}
export function TargetSelector(props: TargetSelectorProps): JSX.Element {
  const userData = useUserData();

  const coordinateAdjusted = createMemo(() => {
    const c = userData?.coordinate();
    if (c === undefined) {
      return undefined;
    }
    const adjusted = getClosestPixel(c);
    adjusted.x -= CONSTS.gameBoard.borderTargetPx;
    adjusted.y -= CONSTS.gameBoard.borderTargetPx;
    return adjusted;
  });

  return (
    <Show when={coordinateAdjusted() !== undefined}>
      <div
        class={styles.TargetSelector}
        style={{
          left: `${coordinateAdjusted()?.x}px`,
          top: `${coordinateAdjusted()?.y}px`,
          width: `${CONSTS.gameBoard.pixelSizePx}px`,
          height: `${CONSTS.gameBoard.pixelSizePx}px`,
          border: `${CONSTS.gameBoard.borderTargetPx}px solid red`,
        }}
      ></div>
    </Show>
  );
}

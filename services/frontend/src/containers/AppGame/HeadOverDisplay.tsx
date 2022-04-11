import { createMemo, createSignal, JSX } from "solid-js";
import { useControl } from "../../context/ControlContext";
import { useUserData } from "../../context/UserDataContext";
import { getAdjustedPixel } from "../../logics/pixel";
import styles from "./HeadOverDisplay.module.css";
export interface HeadOverDisplayProps {}
export function HeadOverDisplay(props: HeadOverDisplayProps): JSX.Element {
  const userData = useUserData();
  const adjustedCoordinate = createMemo(() => {
    const c = userData?.selectedCoordinate();
    if (c === undefined) {
      return undefined;
    } else {
      return getAdjustedPixel(c);
    }
  });
  return (
    <div class={styles.HeadOverDisplay}>
      <div class={styles.HeadOverDisplayPanel}>
        <div class={styles.HeadOverDisplayPanelContent}>
          <div>Zoom</div>
          <div>{userData?.zoom().toFixed(1)}x</div>
        </div>
        <div class={styles.HeadOverDisplayPanelContent}>
          <div>Selection</div>
          <div>
            {adjustedCoordinate() === undefined ? (
              <span>No selection</span>
            ) : (
              <span>
                [{adjustedCoordinate()?.x},{adjustedCoordinate()?.y}]
              </span>
            )}
          </div>
        </div>
        <div class={styles.HeadOverDisplayPanelContent}>
          <div>Next action in:</div>
          <div>23 sec</div>
        </div>
      </div>
    </div>
  );
}

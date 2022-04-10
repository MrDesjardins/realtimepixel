import { createMemo, createSignal, JSX } from "solid-js";
import { useControl } from "../../context/ControlContext";
import { useUserData } from "../../context/UserDataContext";
import { getAdjustedPixel } from "../../logics/pixel";
import styles from "./HeadOverDisplay.module.css";
export interface HeadOverDisplayProps {}
export function HeadOverDisplay(props: HeadOverDisplayProps): JSX.Element {
  const userData = useUserData();
  const adjustedCoordinate = createMemo(() => {
    return getAdjustedPixel(userData?.coordinate() ?? { x: 0, y: 0 });
  });
  return (
    <div class={styles.HeadOverDisplay}>
      <div class={styles.HeadOverDisplayPanel}>
        <div class={styles.HeadOverDisplayPanelContent}>
          <div>Zoom</div>
          <div>{userData?.zoom().toFixed(1)}x</div>
        </div>
        <div class={styles.HeadOverDisplayPanelContent}>
          <div>Coordinate</div>
          <div>
            [{adjustedCoordinate().x},{adjustedCoordinate().y}]
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

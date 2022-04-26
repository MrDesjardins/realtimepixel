import { createMemo, JSX } from "solid-js";
import { useUserData } from "../../context/UserDataContext";
import { getAdjustedPixel } from "../../logics/pixel";
import { createTimeCounter } from "../../reactivities/createTimeCounter";
import styles from "./HeadOverDisplay.module.css";
import { NextActionTimeText } from "./NextActionTimeText";
export interface HeadOverDisplayProps {}
export function HeadOverDisplay(props: HeadOverDisplayProps): JSX.Element {
  const userData = useUserData();
  const adjustedCoordinate = createMemo(() => {
    const c = userData?.state.selectedCoordinate;
    if (c === undefined) {
      return undefined;
    } else {
      return getAdjustedPixel(c);
    }
  });

  const nextActionTime = createTimeCounter(() => userData?.state.lastActionEpochtime);
  return (
    <div class={styles.HeadOverDisplay}>
      <div class={styles.HeadOverDisplayPanel}>
        <div class={styles.HeadOverDisplayPanelContent}>
          <div>Zoom</div>
          <div>{userData?.state.zoom.toFixed(1)}x</div>
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
          <div>
            &nbsp;
            <NextActionTimeText seconds={nextActionTime()} />
          </div>
        </div>
      </div>
    </div>
  );
}

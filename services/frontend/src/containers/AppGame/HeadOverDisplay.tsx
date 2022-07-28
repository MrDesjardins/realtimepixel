import { createMemo, JSX } from "solid-js";
import { getTileLife } from "@shared/logics/time";
import { useUserData } from "../../context/UserDataContext";
import { getAdjustedPixel } from "../../logics/pixel";
import { createTimeCounter } from "../../reactivities/createTimeCounter";
import styles from "./HeadOverDisplay.module.css";
import { NextActionTimeText } from "./NextActionTimeText";
import { CONST_RULES } from "@shared/constants/rules";
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

  const life = createMemo(() => {
    const c = userData?.state.selectedCoordinate;
    if (c === undefined) {
      return undefined;
    } else {
      const coord = getAdjustedPixel(c);
      const tile = userData?.state.tiles.get(`${coord.x}-${coord.y}`);
      if (tile === undefined) {
        return undefined;
      } else {
        return getTileLife(Date.now().valueOf(), tile.time);
      }
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
          <div>Coordinate</div>
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
          <div>Pixel Life</div>
          <div>
            {adjustedCoordinate() === undefined ? (
              <span>No selection</span>
            ) : (
              <span>
                {life() === undefined ? (
                  <span>N/A</span>
                ) : (
                  <span>
                    {life()}/{CONST_RULES.pixelInitialLifeUnit}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
        <div class={styles.HeadOverDisplayPanelContent}>
          <div>Next action</div>
          <div>
            <NextActionTimeText seconds={nextActionTime()} />
          </div>
        </div>
      </div>
    </div>
  );
}

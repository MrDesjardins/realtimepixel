import { createMemo, JSX, Show } from "solid-js";
import { useUserData } from "../../context/UserDataContext";
import { getClosestPixel } from "../../logics/pixel";
import { CONSTS } from "../../models/constants";
import { COLORS } from "@shared/constants/colors";
import styles from "./PixelSelected.module.css";
export interface PixelSelectedProps {}
export function PixelSelected(props: PixelSelectedProps): JSX.Element {
  const userData = useUserData();

  const coordinateAdjusted = createMemo(() => {
    const c = userData?.state.selectedCoordinate;
    if (c) {
      const adjusted = getClosestPixel(c);
      return adjusted;
    } else {
      return undefined;
    }
  });

  const getPixelColor = createMemo(() => {
    const colorIndex = userData?.state.selectedColor;
    if (colorIndex === undefined) {
      return "transparent";
    }
    const colorData = COLORS[colorIndex];
    return `rgb(${colorData.r},${colorData.g},${colorData.b})`;
  });

  return (
    <Show when={coordinateAdjusted() !== undefined}>
      <div
        class={styles.PixelSelected}
        style={{
          left: `${coordinateAdjusted()?.x}px`,
          top: `${coordinateAdjusted()?.y}px`,
          width: `${CONSTS.gameBoard.pixelSizePx}px`,
          height: `${CONSTS.gameBoard.pixelSizePx}px`,
          "background-color": getPixelColor(),
        }}
      >
        <svg
          class={styles.svg}
          height={`${CONSTS.gameBoard.pixelSizePx}px`}
          width={`${CONSTS.gameBoard.pixelSizePx}px`}
          viewBox={`0 0 ${CONSTS.gameBoard.pixelSizePx} ${CONSTS.gameBoard.pixelSizePx}`}
        >
          <rect
            width={CONSTS.gameBoard.pixelSizePx}
            height={CONSTS.gameBoard.pixelSizePx}
            class={styles.svgSelection}
            fill="none"
            style={{
              "stroke-width": `${CONSTS.gameBoard.selectedBorderTargetPx}px`,
              stroke: `rgb(0,0,0)`,
            }}
          />
        </svg>
      </div>
    </Show>
  );
}

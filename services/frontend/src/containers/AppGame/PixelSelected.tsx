import { createMemo, JSX } from "solid-js";
import { useControl } from "../../context/ControlContext";
import { useUserData } from "../../context/UserDataContext";
import { getClosestPixel } from "../../logics/pixel";
import { CONSTS } from "../../models/constants";
import styles from "./PixelSelected.module.css";
export interface PixelSelectedProps {}
export function PixelSelected(props: PixelSelectedProps): JSX.Element {
  const control = useControl();
  const userData = useUserData();

  let containerRef: HTMLDivElement | undefined = undefined;

  const coordinateAdjusted = createMemo(() => {
    const adjusted = getClosestPixel(
      userData?.selectedCoordinate() ?? { x: 0, y: 0 }
    );

    return adjusted;
  });

  return (
    <div
      ref={containerRef}
      class={styles.PixelSelected}
      style={{
        left: `${coordinateAdjusted().x}px`,
        top: `${coordinateAdjusted().y}px`,
        width: `${CONSTS.gameBoard.pixelSizePx}px`,
        height: `${CONSTS.gameBoard.pixelSizePx}px`,
      }}
      onClick={(e) => {
        const rect = containerRef?.getBoundingClientRect();
        const clickedX = e.clientX - (rect?.left ?? 0);
        const clickedY = e.clientY - (rect?.top ?? 0);
        console.log("Up", clickedX, clickedY);
        // if (!control?.isDragging()) {
        //   userData?.setSelectedCoordinate(undefined);
        // }
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
            "stroke-width": `${CONSTS.gameBoard.borderTargetPx}px`,
            stroke: `rgb(0,0,0)`,
          }}
        />
      </svg>
    </div>
  );
}

import type { JSX } from "solid-js";
import styles from "./GameBoardContainer.module.css";
export interface GameBoardContainerProps {}
export function GameBoardContainer(
  props: GameBoardContainerProps
): JSX.Element {
  let canvasRef: HTMLCanvasElement | undefined = undefined;
  let frame: number;
  let canvasHeight = 470;
  let canvasWidth = 1024;
  return (
    <div class={styles.GameBoardContainer}>
      <canvas
        ref={canvasRef}
        class={styles.Canvas}
        width={canvasWidth}
        height={canvasHeight}
      />
      {/* <div class={styles.Canvas}>Test</div> */}
    </div>
  );
}

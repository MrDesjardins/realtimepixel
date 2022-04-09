import { JSX, onCleanup, onMount } from "solid-js";
import { CONSTS } from "../../models/constants";
import styles from "./GameBoardContainer.module.css";
export interface GameBoardContainerProps {}
export function GameBoardContainer(
  props: GameBoardContainerProps
): JSX.Element {
  let canvasRef: HTMLCanvasElement | undefined = undefined;
  let frame: number;
  let lastTime = 0;
  onMount(() => {
    frame = requestAnimationFrame(draw);
    onCleanup(() => cancelAnimationFrame(frame));
  });

  const drawPixel = (
    canvasData: ImageData,
    x: number,
    y: number,
    r: number,
    g: number,
    b: number,
    a: number = 255
  ): void => {
    const index = (x + y * CONSTS.gameBoard.pixelWidth) * 4;

    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
  };
  const draw = (time: number) => {
    const ctx = canvasRef?.getContext("2d") ?? null;
    if (ctx) {
      if (time > lastTime + 1000 / CONSTS.gameBoard.fps) {
        ctx.clearRect(
          0,
          0,
          CONSTS.gameBoard.pixelWidth,
          CONSTS.gameBoard.pixelHeight
        );
        const canvasData = ctx.getImageData(
          0,
          0,
          CONSTS.gameBoard.pixelWidth,
          CONSTS.gameBoard.pixelHeight
        );
        for (let x = 0; x < CONSTS.gameBoard.pixelWidth; x++) {
          for (let y = 0; y < CONSTS.gameBoard.pixelHeight; y++) {
            drawPixel(canvasData, x, y, 0, 199, 100);
          }
        }
        ctx.putImageData(canvasData, 0, 0);
        console.log("draw");
        lastTime = time;
      }
      frame = requestAnimationFrame(draw);
    }
  };
  return (
    <div class={styles.GameBoardContainer}>
      <canvas
        ref={canvasRef}
        class={styles.Canvas}
        width={CONSTS.gameBoard.pixelWidth}
        height={CONSTS.gameBoard.pixelHeight}
      />
    </div>
  );
}

import { JSX, onCleanup, onMount } from "solid-js";
import { COLORS, CONSTS } from "../../models/constants";
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
        let i = 0;
        for (
          let x = 0;
          x < CONSTS.gameBoard.pixelWidth;
          x += CONSTS.gameBoard.pixelSize
        ) {
          for (
            let y = 0;
            y < CONSTS.gameBoard.pixelHeight;
            y += CONSTS.gameBoard.pixelSize
          ) {
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            //drawPixel(canvasData, x, y, color.r, color.g, color.b);
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
            ctx.fillRect(
              x,
              y,
              CONSTS.gameBoard.pixelSize,
              CONSTS.gameBoard.pixelSize
            );
          }
        }
        //ctx.putImageData(canvasData, 0, 0);
        console.log("draw");
        lastTime = time;
      }
      //frame = requestAnimationFrame(draw);
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

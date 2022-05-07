import { COLORS } from "@shared/constants/colors";
import { getAlphaValue } from "@shared/logics/time";
import { createEffect, JSX, on, onCleanup, onMount } from "solid-js";
import { useUserData } from "../../context/UserDataContext";
import { getCoordinateToPixelValue } from "../../logics/pixel";
import { CONSTS } from "../../models/constants";
import styles from "./GameBoardContainer.module.css";
export interface GameBoardContainerProps {}
export function GameBoardContainer(props: GameBoardContainerProps): JSX.Element {
  let canvasRef: HTMLCanvasElement | undefined = undefined;
  let frame: number;
  let lastTime = 0;

  const userData = useUserData();

  onMount(() => {
    // frame = requestAnimationFrame(draw); // Commented because instead of looping we only render when new tiles are added
    onCleanup(() => cancelAnimationFrame(frame));
  });

  // Update when a tiles is changing (or when get the first load)
  const tracked = () => userData?.state.tiles;
  createEffect(
    on(tracked, () => {
      const ctx = canvasRef?.getContext("2d") ?? null;
      if (ctx !== null) {
        clearAndSetPixelOnCanvas(ctx);
      }
    }),
  );

  const draw = (time: number) => {
    const ctx = canvasRef?.getContext("2d") ?? null;
    if (ctx) {
      console.log("Draw time", time, userData?.state.tiles.entries());
      if (time > lastTime + 1000 / CONSTS.gameBoard.fps) {
        clearAndSetPixelOnCanvas(ctx);
        lastTime = time;
      }
      frame = requestAnimationFrame(draw);
    }
  };
  return (
    <div
      class={styles.GameBoardContainer}
      style={{ width: `${CONSTS.gameBoard.boardWidthPx}px`, height: `${CONSTS.gameBoard.boardHeightPx}px` }}
    >
      <canvas
        ref={canvasRef}
        class={styles.Canvas}
        width={CONSTS.gameBoard.boardWidthPx}
        height={CONSTS.gameBoard.boardHeightPx}
      />
    </div>
  );

  function clearAndSetPixelOnCanvas(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, CONSTS.gameBoard.boardWidthPx, CONSTS.gameBoard.boardHeightPx);
    if (userData) {
      const currentEpochTime = Date.now().valueOf();
      for (const [key, t] of userData.state.tiles.entries()) {
        const color = COLORS[t.color];
        const alpha = getAlphaValue(currentEpochTime, t.time);
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        const coordinatePixel = getCoordinateToPixelValue(t.coordinate);
        ctx.fillRect(
          coordinatePixel.x,
          coordinatePixel.y,
          CONSTS.gameBoard.pixelSizePx,
          CONSTS.gameBoard.pixelSizePx,
        );
      }
    }
    console.log("draw");
  }
}

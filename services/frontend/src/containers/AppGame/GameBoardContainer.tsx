import { createEffect, createSignal, JSX, on, onCleanup, onMount } from "solid-js";
import { CONSTS } from "../../models/constants";
import { COLORS } from "@shared/constants/colors";
import { Tile } from "@shared/models/game";
import styles from "./GameBoardContainer.module.css";
import { useUserData } from "../../context/UserDataContext";
export interface GameBoardContainerProps {}
export function GameBoardContainer(props: GameBoardContainerProps): JSX.Element {
  let canvasRef: HTMLCanvasElement | undefined = undefined;
  let frame: number;
  let lastTime = 0;

  const userData = useUserData();

  onMount(() => {
    frame = requestAnimationFrame(draw);
    onCleanup(() => cancelAnimationFrame(frame));
  });

  // Update when a tiles is changing (or when get the first load)
  const tracked = () => userData?.state.tiles;
  createEffect(
    on(tracked, () => {
      draw(Date.now());
    }),
  );

  const draw = (time: number) => {
    const ctx = canvasRef?.getContext("2d") ?? null;
    if (ctx) {
      if (time > lastTime + 1000 / CONSTS.gameBoard.fps) {
        ctx.clearRect(0, 0, CONSTS.gameBoard.boardWidthPx, CONSTS.gameBoard.boardHeightPx);
        if (userData) {
          for (const [key, t] of userData.state.tiles.entries()) {
            const color = COLORS[t.color];
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
            ctx.fillRect(
              t.coordinate.x,
              t.coordinate.y,
              CONSTS.gameBoard.pixelSizePx,
              CONSTS.gameBoard.pixelSizePx,
            );
          }
        }
        console.log("draw");
        lastTime = time;
      }
      //frame = requestAnimationFrame(draw); // todo: uncomment to redraw
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
}

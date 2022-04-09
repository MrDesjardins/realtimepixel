import { createEffect, createSignal, JSX } from "solid-js";
import { Zoom } from "../../models/enums";
import { Coordinate } from "../../models/game";
import styles from "./AppGame.module.css";
export interface AppGameProps {
  children: JSX.Element;
  onPanning: (coord: Coordinate) => void;
  onZoom(zoom: Zoom): void;
  isPanning: (dragging: boolean) => void;
}
export function AppGame(props: AppGameProps): JSX.Element {
  const [isDragging, setIsDragging] = createSignal(false);
  const [coordinate, setCoordinate] = createSignal<Coordinate>({ x: 0, y: 0 });

  let containerRef: HTMLDivElement | undefined = undefined;
  let startingClickCoordinate: Coordinate = { x: 0, y: 0 };

  function adjust(finalCoordinate: Coordinate) {
    const coord: Coordinate = {
      x: finalCoordinate.x - startingClickCoordinate.x,
      y: finalCoordinate.y - startingClickCoordinate.y,
    };

    props.onPanning(coord);
  }

  createEffect(() => {
    props.isPanning(isDragging());
  });

  return (
    <div
      ref={containerRef}
      class={styles.AppGame}
      onWheel={(e) => {
        props.onZoom(e.deltaY < 0 ? Zoom.In : Zoom.Out);
      }}
      onMouseDown={(e) => {
        startingClickCoordinate = {
          x: e.offsetX - coordinate().x,
          y: e.offsetY - coordinate().y,
        };
        setIsDragging(true);
      }}
      onMouseMove={(e) => {
        if (isDragging()) {
          adjust({ x: e.offsetX, y: e.offsetY });
        }
      }}
      onMouseUp={(e) => {
        const coord: Coordinate = {
          x: e.x - startingClickCoordinate.x,
          y: e.y - startingClickCoordinate.y,
        };
        setCoordinate(coord);
        setIsDragging(false);
      }}
      onMouseLeave={(e) => {
        setIsDragging(false);
      }}
    >
      {props.children}
    </div>
  );
}

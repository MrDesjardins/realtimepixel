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

  let containerRef: HTMLDivElement | undefined = undefined;
  let startingClickCoordinate: Coordinate = { x: 0, y: 0 };

  function adjust(finalCoordinate: Coordinate) {
    const offsets = getOffset();
    const coord: Coordinate = {
      x: finalCoordinate.x - startingClickCoordinate.x,
      y: finalCoordinate.y - startingClickCoordinate.y,
    };
    console.log("New:", finalCoordinate);
    props.onPanning(coord);
  }

  createEffect(() => {
    props.isPanning(isDragging());
  });

  const getOffset = (): [number, number] => {
    if (containerRef) {
      const rect = containerRef.getBoundingClientRect();
      return [rect.left, rect.top];
    }
    return [0, 0];
  };

  return (
    <div
      ref={containerRef}
      class={styles.AppGame}
      onWheel={(e) => {
        props.onZoom(e.deltaY < 0 ? Zoom.In : Zoom.Out);
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        startingClickCoordinate = { x: e.offsetX, y: e.offsetY };
        console.log("Starting:", startingClickCoordinate);
        setIsDragging(true);
      }}
      onMouseMove={(e) => {
        //e.stopPropagation();
        if (isDragging()) {
          adjust({ x: e.offsetX, y: e.offsetY });
        }
      }}
      onMouseUp={(e) => {
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

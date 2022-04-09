import { createEffect, createSignal, JSX } from "solid-js";
import { useControl } from "../../context/ControlContext";
import { Zoom } from "../../models/enums";
import { Coordinate } from "../../models/game";
import styles from "./AppGame.module.css";
export interface AppGameProps {
  children: JSX.Element;
  onPanning: (coord: Coordinate) => void;
  onZoom(zoom: Zoom): void;
}
export function AppGame(props: AppGameProps): JSX.Element {
  const control = useControl();
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
        control?.setIsClicking(true);
      }}
      onMouseMove={(e) => {
        if (control?.getIsClicking()) {
          control?.setIsDragging(true);
          adjust({ x: e.offsetX, y: e.offsetY });
        }
      }}
      onMouseUp={(e) => {
        const coord: Coordinate = {
          x: e.x - startingClickCoordinate.x,
          y: e.y - startingClickCoordinate.y,
        };
        // Notify that we change the coordinate (we are panning)
        if (control?.getIsDragging()) {
          setCoordinate(coord);
        } else {
          // No dragging, means a click: action
          console.log("Click", { x: e.x, y: e.y });
        }
        control?.setIsDragging(false);
        control?.setIsClicking(false);
      }}
      onMouseLeave={(e) => {
        control?.setIsDragging(false);
        control?.setIsClicking(false);
      }}
    >
      {props.children}
    </div>
  );
}

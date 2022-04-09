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
  let containerRef: HTMLDivElement | undefined = undefined;

  return (
    <div
      ref={containerRef}
      class={styles.AppGame}
      onWheel={(e) => {
        props.onZoom(e.deltaY < 0 ? Zoom.In : Zoom.Out);
      }}
    >
      {props.children}
    </div>
  );
}

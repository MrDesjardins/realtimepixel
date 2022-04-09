import { createEffect, createSignal, JSX } from "solid-js";
import { useControl } from "../../context/ControlContext";
import { Zoom } from "../../models/enums";
import { Coordinate } from "../../models/game";
import styles from "./AppGame.module.css";
export interface AppGameProps {
  children: JSX.Element;
}
export function AppGame(props: AppGameProps): JSX.Element {
  let containerRef: HTMLDivElement | undefined = undefined;
  const control = useControl();
  return (
    <div
      ref={containerRef}
      class={styles.AppGame}
    >
      {props.children}
    </div>
  );
}

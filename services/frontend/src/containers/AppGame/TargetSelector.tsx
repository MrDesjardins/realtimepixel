import { createEffect, createSignal, JSX } from "solid-js";
import { Coordinate } from "../../models/game";
import styles from "./TargetSelector.module.css";
export interface TargetSelectorProps {
  display: boolean;
  coordinate: Coordinate;
}
export function TargetSelector(props: TargetSelectorProps): JSX.Element {
  return (
    <div
      class={styles.TargetSelector}
      style={{
        left: `${props.coordinate.x}px`,
        top: `${props.coordinate.y}px`,
        visibility: props.display ? "visible" : "hidden",
      }}
    ></div>
  );
}

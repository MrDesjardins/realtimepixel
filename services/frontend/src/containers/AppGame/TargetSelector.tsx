import { createEffect, createSignal, JSX } from "solid-js";
import styles from "./TargetSelector.module.css";
export interface TargetSelectorProps {
  display: boolean;
  x: number;
  y: number;
}
export function TargetSelector(props: TargetSelectorProps): JSX.Element {
  return (
    <div
      class={styles.TargetSelector}
      style={{
        left: `${props.x}px`,
        top: `${props.y}px`,
        visibility: props.display ? "visible" : "hidden",
      }}
    ></div>
  );
}

import type { JSX } from "solid-js";
import styles from "./AppControls.module.css";
export interface AppControlsProps {
  children: JSX.Element;
}
export function AppControls(props: AppControlsProps): JSX.Element {
  return <div class={styles.AppControls}>{props.children}</div>;
}

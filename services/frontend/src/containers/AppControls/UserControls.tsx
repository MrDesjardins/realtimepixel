import type { JSX } from "solid-js";
import styles from "./UserControls.module.css";
export interface UserControlsProps {}
export function UserControls(props: UserControlsProps): JSX.Element {
  return <div class={styles.UserControls}>User Controls</div>;
}

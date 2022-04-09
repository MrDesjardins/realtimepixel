import type { JSX } from "solid-js";
import styles from "./UserHelps.module.css";
export interface UserHelpsProps {}
export function UserHelps(props: UserHelpsProps): JSX.Element {
  return <div class={styles.UserHelps}>User Help</div>;
}

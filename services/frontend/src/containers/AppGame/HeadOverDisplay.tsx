import { createSignal, JSX } from "solid-js";
import { useControl } from "../../context/ControlContext";
import styles from "./HeadOverDisplay.module.css";
export interface HeadOverDisplayProps {}
export function HeadOverDisplay(props: HeadOverDisplayProps): JSX.Element {
  const control = useControl();
  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);
  return (
    <div class={styles.HeadOverDisplay}>
      <div class={styles.HeadOverDisplayPanel}>
        <div class={styles.HeadOverDisplayPanelContent}>
          <div>Zoom</div>
          <div>1.0x</div>
        </div>
        <div class={styles.HeadOverDisplayPanelContent}>
          <div>Coordinate</div>
          <div>[123,12345]</div>
        </div>
        <div class={styles.HeadOverDisplayPanelContent}>
          <div>Next action in:</div>
          <div>23 sec</div>
        </div>
      </div>
    </div>
  );
}

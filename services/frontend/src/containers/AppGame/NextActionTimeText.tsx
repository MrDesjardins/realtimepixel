import { JSX } from "solid-js";
import { CONSTS } from "../../models/constants";
import styles from "./NextActionTimeText.module.css";
export interface NextActionTimeTextProps {
  seconds: number;
}
export function NextActionTimeText(props: NextActionTimeTextProps): JSX.Element {
  // const isAlmostReady = props.seconds <= CONSTS.gameRules.userPixelDelaySeconds * 0.2;
  // const isReady = props.seconds === 0;

  return (
    <p class={styles.NextActionTimeText}>
      <span
        class={styles.NextActionTimeTextSpan}
        classList={{
          [styles.NextActionTimeTextAlmost]: props.seconds <= CONSTS.gameRules.userPixelDelaySeconds * 0.2,
          [styles.NextActionTimeTextCompleted]: props.seconds === 0,
        }}
      >
        {props.seconds === 0 ? "Now !!!" : props.seconds + " seconds"}
      </span>
    </p>
  );
}

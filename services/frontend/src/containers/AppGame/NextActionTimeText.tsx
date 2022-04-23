import { JSX } from "solid-js";
import { CONST_RULES } from "@shared/constants/rules";
import styles from "./NextActionTimeText.module.css";

export interface NextActionTimeTextProps {
  seconds: number | undefined;
}
export function NextActionTimeText(props: NextActionTimeTextProps): JSX.Element {
  return (
    <p class={styles.NextActionTimeText}>
      <span
        class={styles.NextActionTimeTextSpan}
        classList={{
          [styles.NextActionTimeTextAlmost]:
            props.seconds !== undefined && props.seconds <= CONST_RULES.userPixelDelaySeconds * 0.2,
          [styles.NextActionTimeTextCompleted]: props.seconds === 0,
        }}
      >
        {props.seconds === undefined ? "Wait" : props.seconds === 0 ? "Now !!!" : props.seconds + " seconds"}
      </span>
    </p>
  );
}

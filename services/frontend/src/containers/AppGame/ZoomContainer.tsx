import { createEffect, createSignal, JSX } from "solid-js";
import { Zoom } from "../../models/enums";
import styles from "./ZoomContainer.module.css";
export interface ZoomContainerProps {
  children: JSX.Element;
  zoomValue: Zoom;
}
export function ZoomContainer(props: ZoomContainerProps): JSX.Element {
  const [scaling, setScaling] = createSignal(1);
  createEffect(() => {
    setScaling(props.zoomValue);
  });
  return (
    <div
      className={styles.ZoomContainer}
      style={{
        transform: `scale(${scaling()})`,
      }}
    >
      {props.children}
    </div>
  );
}

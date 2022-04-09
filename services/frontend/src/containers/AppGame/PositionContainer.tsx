import type { JSX } from "solid-js";
import { Coordinate } from "../../models/game";
import styles from "./PositionContainer.module.css";
export interface PositionContainerProps {
  children: JSX.Element;
  coordinate: Coordinate;
}
export function PositionContainer(props: PositionContainerProps): JSX.Element {
  return (
    <div
      class={styles.PositionContainer}
      style={{
        transform: `translate(${props.coordinate.x}px, ${props.coordinate.y}px)`,
      }}
    >
      {props.children}
    </div>
  );
}

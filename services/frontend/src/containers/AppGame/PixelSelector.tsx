import { createEffect, createSignal, JSX } from "solid-js";
import { Zoom } from "../../models/enums";
import { Coordinate } from "../../models/game";
import styles from "./PixelSelector.module.css";
export interface PixelSelectorProps {
  children: JSX.Element;
  onPixelSelected: (coord: Coordinate) => void;
}
export function PixelSelector(props: PixelSelectorProps): JSX.Element {
  return (
    <div
      className={styles.PixelSelector}
      onMouseDown={(e) => {
        console.log("Down", e.offsetX, e.offsetY);
      }}
      onMouseMove={(e) => {
        console.log("Move", e.offsetX, e.offsetY);
      }}
      onMouseUp={(e) => {
        console.log("Up", e.offsetX, e.offsetY);
      }}
    >
      {props.children}
    </div>
  );
}

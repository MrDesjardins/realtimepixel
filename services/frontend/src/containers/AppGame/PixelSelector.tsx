import { batch, createEffect, createSignal, JSX } from "solid-js";
import { useControl } from "../../context/ControlContext";
import { useUserData } from "../../context/UserDataContext";
import { Zoom } from "../../models/enums";
import { Coordinate } from "../../models/game";
import styles from "./PixelSelector.module.css";
import { TargetSelector } from "./TargetSelector";
export interface PixelSelectorProps {
  children: JSX.Element;
}
export function PixelSelector(props: PixelSelectorProps): JSX.Element {
  const control = useControl();
  const userData = useUserData();
  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);
  return (
    <div
      className={styles.PixelSelector}
      style={{ cursor: control?.getIsDragging() ? "pointer" : "none" }}
      onMouseDown={(e) => {
        console.log("Down", e.offsetX, e.offsetY);
      }}
      onMouseMove={(e) => {
        if (!control?.getIsDragging()) {
          if (e.offsetX > 0 && e.offsetY > 0) {
            batch(() => {
              setX(e.offsetX);
              setY(e.offsetY);
            });
            userData?.setCoordinate({ x: e.offsetX, y: e.offsetY });
          }
        }
      }}
      onMouseUp={(e) => {
        if (!control?.getIsDragging()) {
          console.log("Up", e.offsetX, e.offsetY);
          userData?.setSelectedCoordinate({ x: e.offsetX, y: e.offsetY });
        }
      }}
    >
      <TargetSelector display={!control?.getIsDragging()} x={x()} y={y()} />
      {props.children}
    </div>
  );
}

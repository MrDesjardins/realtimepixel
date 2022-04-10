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
  let containerRef: HTMLDivElement | undefined = undefined;
  return (
    <div
      ref={containerRef}
      className={styles.PixelSelector}
      // style={{ cursor: control?.isDragging() ? "pointer" : "none" }}
      onMouseMove={(e) => {
        if (!control?.isDragging()) {
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
        const rect = containerRef?.getBoundingClientRect();
        const clickedX = e.clientX - (rect?.left ?? 0);
        const clickedY = e.clientY - (rect?.top ?? 0);
        console.log("Up", clickedX, clickedY);
        console.log("Rect", containerRef?.getBoundingClientRect());
        if (!control?.isDragging()) {
          userData?.setSelectedCoordinate({ x: clickedX, y: clickedY });
        }
      }}
    >
      <TargetSelector
        display={!control?.isDragging()}
        coordinate={userData?.coordinate()!}
      />
      {props.children}
    </div>
  );
}

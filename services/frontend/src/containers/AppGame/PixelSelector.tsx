import { JSX } from "solid-js";
import { useControl } from "../../context/ControlContext";
import { useUserData } from "../../context/UserDataContext";
import styles from "./PixelSelector.module.css";
import { TargetSelector } from "./TargetSelector";
export interface PixelSelectorProps {
  children: JSX.Element;
}
export function PixelSelector(props: PixelSelectorProps): JSX.Element {
  const control = useControl();
  const userData = useUserData();

  let containerRef: HTMLDivElement | undefined = undefined;
  return (
    <div
      ref={containerRef}
      className={styles.PixelSelector}
      style={{ cursor: control?.isDragging() ? "pointer" : "none" }}
      onMouseMove={(e) => {
        if (!control?.isDragging()) {
          console.log("Pixel Selector offset", e.offsetX, e.offsetY);
          if (e.offsetX > 0 && e.offsetY > 0) {
            userData?.setCoordinate({ x: e.offsetX, y: e.offsetY });
          }
        }
      }}
      onClick={(e) => {
        const rect = containerRef?.getBoundingClientRect();
        const clickedX = e.clientX - (rect?.left ?? 0);
        const clickedY = e.clientY - (rect?.top ?? 0);
        console.log("Up", clickedX, clickedY);
        if (!control?.isDragging()) {
          userData?.setSelectedCoordinate({ x: clickedX, y: clickedY });
        }
      }}
    >
      <TargetSelector />
      {props.children}
    </div>
  );
}

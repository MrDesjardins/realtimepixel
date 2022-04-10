import { JSX } from "solid-js";
import { useControl } from "../../context/ControlContext";
import { useUserData } from "../../context/UserDataContext";
import { PixelSelected } from "./PixelSelected";
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
      class={styles.PixelSelector}
      //style={{ cursor: control?.isDragging() ? "pointer" : "none" }}
      onMouseMove={(e) => {
        if (!control?.isDragging()) {
          //console.log("Pixel Selector offset", e.offsetX, e.offsetY);
          userData?.setCoordinate({ x: e.offsetX, y: e.offsetY });
        }
      }}
      onMouseUp={(e) => {
        if (!control?.isDragging()) {
          userData?.setSelectedCoordinate({ x: e.offsetX, y: e.offsetY });
        }
      }}
    >
      <TargetSelector />
      <PixelSelected />
      {props.children}
    </div>
  );
}

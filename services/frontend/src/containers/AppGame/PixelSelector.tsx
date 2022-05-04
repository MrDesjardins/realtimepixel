import { createMemo, JSX, Show } from "solid-js";
import { useControl } from "../../context/ControlContext";
import { useNotification } from "../../context/NotificationContext";
import { useUserData } from "../../context/UserDataContext";
import { getClosestPixel } from "../../logics/pixel";
import { PixelSelected } from "./PixelSelected";
import styles from "./PixelSelector.module.css";
import { TargetSelector } from "./TargetSelector";
export interface PixelSelectorProps {
  children: JSX.Element;
}
export function PixelSelector(props: PixelSelectorProps): JSX.Element {
  const control = useControl();
  const userData = useUserData();
  
  const coordinateAdjusted = createMemo(() => {
    const c = userData?.state.selectedCoordinate;
    if (c) {
      const adjusted = getClosestPixel(c);
      return adjusted;
    } else {
      return undefined;
    }
  });

  let containerRef: HTMLDivElement | undefined = undefined;
  return (
    <div
      ref={containerRef}
      class={styles.PixelSelector}
      style={{ cursor: control?.isDragging() ? "pointer" : "none" }}
      onPointerMove={(e) => {
        if (!control?.isDragging()) {
          //console.log("Pixel Selector offset", e.offsetX, e.offsetY);
          userData?.actions.setCoordinate({ x: e.offsetX, y: e.offsetY });
        }
      }}
      onPointerLeave={() => {
        userData?.actions.setCoordinate(undefined);
      }}
      onPointerUp={(e) => {
        if (!control?.isDragging()) {
          const currentSelection = coordinateAdjusted();
          const clickSelection = getClosestPixel({
            x: e.offsetX,
            y: e.offsetY,
          });
          if (
            currentSelection?.x === clickSelection.x &&
            currentSelection?.y === clickSelection.y
          ) {
            // Unselect
            userData?.actions.setSelectedCoordinate(undefined);
          } else {
            userData?.actions.setSelectedCoordinate({ x: e.offsetX, y: e.offsetY });
          }
        }
      }}
    >
      <Show when={control?.isDragging()===false}>
        <TargetSelector />
      </Show>
      <PixelSelected />
      {props.children}
    </div>
  );
}

import { createMemo, JSX, Show } from "solid-js";
import { useControl } from "../../context/ControlContext";
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
    const c = userData?.selectedCoordinate();
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
      onMouseMove={(e) => {
        if (!control?.isDragging()) {
          //console.log("Pixel Selector offset", e.offsetX, e.offsetY);
          userData?.setCoordinate({ x: e.offsetX, y: e.offsetY });
        }
      }}
      onMouseLeave={() => {
        userData?.setCoordinate(undefined);
      }}
      onMouseUp={(e) => {
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
            userData?.setSelectedCoordinate(undefined);
          } else {
            userData?.setSelectedCoordinate({ x: e.offsetX, y: e.offsetY });
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

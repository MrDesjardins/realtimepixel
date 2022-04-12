import { createEffect, createSignal, JSX, on } from "solid-js";
import { useUserData } from "../../context/UserDataContext";
import { COLORS } from "../../models/constants";
import styles from "./AppControls.module.css";
import { ColorPicker } from "./ColorPicker";
export interface AppControlsProps {}
export function AppControls(props: AppControlsProps): JSX.Element {
  const userData = useUserData();
  const [colors, setColors] = createSignal(COLORS);
  let timeOutRef: number | undefined = undefined;
  createEffect(
    // When a new pixel is selected, we reset all the colors
    on(userData!.selectedCoordinate, () => {
      if (userData!.selectedCoordinate !== undefined) {
        clearTimeout(timeOutRef);
        setColors(COLORS);
      }
    }),
  );

  // Animation: Remove one by one each color
  const removeColors = () => {
    const currentColors = colors();
    if (currentColors.length > 0) {
      setColors(currentColors.slice(0, currentColors.length - 1));
      timeOutRef = window.setTimeout(removeColors, 10);
    }
  };

  return (
    <div
      class={styles.AppControls}
      style={{
        height: `${userData?.selectedCoordinate() === undefined || colors().length === 0 ? 0 : 200}px`,
      }}
    >
      <div class={styles.AppControlsColor}>
        <div class={styles.AppControlsColorContainer}>
          <ColorPicker colors={colors()} />
        </div>
        <div class={styles.AppControlsColorButtons}>
          <div
            class={styles.AppControlsColorButton}
            onClick={() => {
              removeColors();
              userData?.setSelectedColor(undefined);
              userData?.setSelectedCoordinate(undefined);
            }}
          >
            <div>Apply</div>
          </div>
        </div>
      </div>
    </div>
  );
}

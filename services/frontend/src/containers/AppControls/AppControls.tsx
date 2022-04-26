import { createEffect, createSignal, JSX, on } from "solid-js";
import { useUserData } from "../../context/UserDataContext";
import { COLORS } from "../../models/constants";
import styles from "./AppControls.module.css";
import { ColorPicker } from "./ColorPicker";
import { LoginOrCreate } from "./LoginOrCreate";
const AppControlHeight = 200;
export interface AppControlsProps {}
export function AppControls(props: AppControlsProps): JSX.Element {
  const userData = useUserData();
  const [colors, setColors] = createSignal(COLORS);
  let timeOutRef: number | undefined = undefined;

  const tracked = () => userData?.state.selectedCoordinate;
  createEffect(
    // When a new pixel is selected, we reset all the colors
    on(tracked, () => {
      if (userData?.state.selectedCoordinate !== undefined) {
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
    } else if (currentColors.length === 0) {
      userData?.actions.setSelectedCoordinate(undefined); // Un-select to see the actual color
    }
  };

  return (
    <div
      class={styles.AppControls}
      style={{
        height: `${AppControlHeight}px`,
        bottom: `${
          userData?.state.selectedCoordinate === undefined || colors().length === 0 ? -AppControlHeight : 0
        }px`,
      }}
    >
      {!userData?.state.isAuthenticated && <LoginOrCreate />}
      {userData?.state.isAuthenticated && (
        <div class={styles.AppControlsColor}>
          <div class={styles.AppControlsColorContainer}>
            <ColorPicker colors={colors()} />
          </div>
          <div class={styles.AppControlsColorButtons}>
            <button
              disabled={!userData.state.isReadyForAction}
              class={styles.AppControlsColorButton}
              onClick={() => {
                userData.actions.setLastActionEpochtime(new Date().getTime());
                removeColors();
                userData.actions.setSelectedColor(undefined);
              }}
            >
              <div>Apply</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

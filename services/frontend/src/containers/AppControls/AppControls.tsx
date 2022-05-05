import { createEffect, createSignal, JSX, on } from "solid-js";
import { useUserData } from "../../context/UserDataContext";
import { COLORS } from "@shared/constants/colors";
import styles from "./AppControls.module.css";
import { ColorPicker } from "./ColorPicker";
import { LoginOrCreate } from "./LoginOrCreate";
import { MsgUserPixel, MsgUserPixelKind } from "../../../../shared/models/socketMessages";
import { getAdjustedPixel } from "../../logics/pixel";
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
              disabled={
                !userData.state.isReadyForAction ||
                userData.state.selectedColor === undefined ||
                userData.state.selectedCoordinate === undefined
              }
              title={
                userData.state.isReadyForAction
                  ? "Click to apply the color"
                  : "Cannot click because your next action is not ready yet"
              }
              class={styles.AppControlsColorButton}
              onClick={() => {
                if (
                  userData.state.selectedColor !== undefined &&
                  userData.state.selectedCoordinate !== undefined &&
                  userData.state.userToken !== undefined
                ) {
                  const msg: MsgUserPixel = {
                    kind: MsgUserPixelKind,
                    color: userData.state.selectedColor,
                    coordinate: getAdjustedPixel(userData.state.selectedCoordinate),
                    accessToken: userData.state.userToken.accessToken,
                  };
                  userData.actions.submitSocketMessage(msg);
                  removeColors();
                } else {
                  console.error("Cannot submit pixel");
                }
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

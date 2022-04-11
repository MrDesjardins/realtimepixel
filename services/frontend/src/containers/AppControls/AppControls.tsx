import type { JSX } from "solid-js";
import { ChildProperties } from "solid-js/web";
import { useUserData } from "../../context/UserDataContext";
import styles from "./AppControls.module.css";
import { ColorPicker } from "./ColorPicker";
export interface AppControlsProps {}
export function AppControls(props: AppControlsProps): JSX.Element {
  const userData = useUserData();
  return (
    <div
      class={styles.AppControls}
      style={{
        height: `${userData?.selectedCoordinate() === undefined ? 0 : 200}px`,
      }}
    >
      <div class={styles.AppControlsColor}>
        <div>Color</div>
        <ColorPicker />
      </div>
    </div>
  );
}

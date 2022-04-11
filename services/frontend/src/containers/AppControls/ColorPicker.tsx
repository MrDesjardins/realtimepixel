import type { JSX } from "solid-js";
import { ChildProperties } from "solid-js/web";
import { useUserData } from "../../context/UserDataContext";
import { COLORS } from "../../models/constants";
import styles from "./ColorPicker.module.css";
export interface ColorPickerProps {}
export function ColorPicker(props: ColorPickerProps): JSX.Element {
  return (
    <div class={styles.ColorPicker}>
      {COLORS.map((color) => (
        <div
          class={styles.ColorPickerColor}
          style={{ "background-color": `rgb(${color.r},${color.g},${color.b})` }}
        ></div>
      ))}
    </div>
  );
}

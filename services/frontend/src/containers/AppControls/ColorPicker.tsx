import { JSX } from "solid-js";
import { useUserData } from "../../context/UserDataContext";
import { SingleColor } from "@shared/models/color";
import styles from "./ColorPicker.module.css";
export interface ColorPickerProps {
  colors: SingleColor[];
}
export function ColorPicker(props: ColorPickerProps): JSX.Element {
  const userData = useUserData();
  return (
    <div class={styles.ColorPicker}>
      {props.colors.map((color, index) => (
        <div
          class={styles.ColorPickerColor}
          classList={{ [styles.ColorPickerColorSelected]: index === userData?.state.selectedColor ?? 0 }}
          style={{ "background-color": `rgb(${color.r},${color.g},${color.b})` }}
          onClick={() => userData?.actions.setSelectedColor(index)}
        ></div>
      ))}
    </div>
  );
}

import { createSignal, JSX } from "solid-js";
import { ChildProperties } from "solid-js/web";
import { useUserData } from "../../context/UserDataContext";
import { COLORS } from "../../models/constants";
import styles from "./ColorPicker.module.css";
export interface ColorPickerProps {}
export function ColorPicker(props: ColorPickerProps): JSX.Element {
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  return (
    <div class={styles.ColorPicker}>
      {COLORS.map((color, index) => (
        <div
          class={styles.ColorPickerColor}
          classList={{ [styles.ColorPickerColorSelected]: index === selectedIndex() }}
          style={{ "background-color": `rgb(${color.r},${color.g},${color.b})` }}
          onClick={() => setSelectedIndex(index)}
        ></div>
      ))}
    </div>
  );
}

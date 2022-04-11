import { createSignal, JSX } from "solid-js";
import { SingleColor } from "../../models/color";
import { COLORS } from "../../models/constants";
import styles from "./ColorPicker.module.css";
export interface ColorPickerProps {
  colors: SingleColor[];
}
export function ColorPicker(props: ColorPickerProps): JSX.Element {
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  return (
    <div class={styles.ColorPicker}>
      {props.colors.map((color, index) => (
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

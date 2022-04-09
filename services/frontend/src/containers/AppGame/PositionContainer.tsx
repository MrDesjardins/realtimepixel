import { createSignal, JSX } from "solid-js";
import { useControl } from "../../context/ControlContext";
import { Coordinate } from "../../models/game";
import styles from "./PositionContainer.module.css";
export interface PositionContainerProps {
  children: JSX.Element;
}
export function PositionContainer(props: PositionContainerProps): JSX.Element {
  const control = useControl();
  const [original, setOriginal] = createSignal<Coordinate>({ x: 0, y: 0 });
  const [translate, setTranslate] = createSignal<Coordinate>({ x: 0, y: 0 });
  const [lastTanslate, setLastTranslate] = createSignal<Coordinate>({
    x: 0,
    y: 0,
  });

  return (
    <div
      class={styles.PositionContainer}
      style={{
        transform: `translate(${translate().x}px, ${translate().y}px)`,
      }}
      onMouseDown={(e) => {
        setOriginal({ x: e.clientX, y: e.clientY });
        control?.setIsClicking(true);
      }}
      onMouseMove={(e) => {
        if (control?.getIsClicking()) {
          control?.setIsDragging(true);
          setTranslate({
            x: e.clientX - original().x + lastTanslate().x,
            y: e.clientY - original().y + lastTanslate().y,
          });
        }
      }}
      onMouseUp={(e) => {
        // Notify that we change the coordinate (we are panning)
        if (control?.getIsDragging()) {
          setLastTranslate({
            x: translate().x,
            y: translate().y,
          });
        } else {
          // No dragging, means a click: action
        }
        control?.setIsDragging(false);
        control?.setIsClicking(false);
      }}
      onMouseLeave={(e) => {
        control?.setIsDragging(false);
        control?.setIsClicking(false);
      }}
    >
      {props.children}
    </div>
  );
}

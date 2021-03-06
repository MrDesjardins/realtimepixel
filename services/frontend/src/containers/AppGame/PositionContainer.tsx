import { createSignal, JSX } from "solid-js";
import { useControl } from "../../context/ControlContext";
import { useUserData } from "../../context/UserDataContext";
import { Coordinate } from "@shared/models/game";
import styles from "./PositionContainer.module.css";
export interface PositionContainerProps {
  children: JSX.Element;
}
export function PositionContainer(props: PositionContainerProps): JSX.Element {
  const control = useControl();
  const userData = useUserData();
  const [original, setOriginal] = createSignal<Coordinate>({ x: 0, y: 0 });
  const [translate, setTranslate] = createSignal<Coordinate>({ x: 0, y: 0 });
  const [lastTanslate, setLastTranslate] = createSignal<Coordinate>({
    x: 0,
    y: 0,
  });

  // When zooming setting the camera in the middle
  // createEffect(
  //   on(userData?.zoom!, (zoom) => {

  //     const moveX = document.body.clientWidth / 2 - translate().x;
  //     const moveY = document.body.clientHeight / 2 - translate().y;
  //     console.log("Position Container", moveX, moveY);
  //     setTranslate({
  //       x: moveX,
  //       y: moveY,
  //     });
  //   }),
  // );
  return (
    <div
      class={styles.PositionContainer}
      style={{
        transform: `translate(${translate().x}px, ${translate().y}px)`,
      }}
      onPointerDown={(e) => {
        setOriginal({ x: e.clientX, y: e.clientY });
        control?.setIsClicking(true);
      }}
      onPointerMove={(e) => {
        if (control?.isClicking()) {
          control?.setIsDragging(true);
          setTranslate({
            x: e.clientX - original().x + lastTanslate().x,
            y: e.clientY - original().y + lastTanslate().y,
          });
        }
      }}
      onPointerUp={(e) => {
        // Notify that we change the coordinate (we are panning)
        if (control?.isDragging()) {
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
      onPointerLeave={(e) => {
        control?.setIsDragging(false);
        control?.setIsClicking(false);
      }}
    >
      {props.children}
    </div>
  );
}

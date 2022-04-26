import { createSignal, JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { useUserData } from "../../context/UserDataContext";
import { CONST_RULES } from "@shared/constants/rules";
import styles from "./HelpContainer.module.css";
export interface HelpContainerProps {}
export function HelpContainer(props: HelpContainerProps): JSX.Element {
  const userData = useUserData();
  const [isHover, setIsHover] = createSignal(false);
  const [isOpen, setIsOpen] = createSignal(false);
  return (
    <div
      class={styles.HelpContainer}
      classList={{
        [styles.HelpContainerOpen]: isHover(),
        [styles.ActionMenuOpen]: userData?.state.selectedCoordinate !== undefined,
      }}
    >
      <button
        class={styles.HelpContainerButton}
        onMouseEnter={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
        onClick={() => {
          setIsOpen((prev) => {
            return !prev;
          });
        }}
      >
        <span class={styles.ShortText}>?</span>
        <span class={styles.LongText} classList={{ [styles.LongTextOpen]: isHover() }}>
          Help
        </span>
      </button>
      <Portal>
        <div class={styles.HelpContainerContent} classList={{ [styles.HelpContainerContentOpen]: isOpen() }}>
          <button
            class={styles.HelpContainerCloseButton}
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Close
          </button>
          <h1>Goal</h1>
          <p>Create art by painting pixels on the board with other people around the world in real time.</p>
          <h1>How</h1>
          <p>Click on a pixel to select it. A bottom panel will open. Select a color. Then click Apply.</p>
          <h1>Rules</h1>
          <ul>
            <li>You can place 1 pixel every {CONST_RULES.userPixelDelaySeconds} seconds</li>
            <li>Each pixel has a life of {CONST_RULES.pixelInitialLifeUnit} units</li>
            <li>Pixel looses 1 unit every {CONST_RULES.decayDelaySeconds} seconds</li>
            <li>
              You can draw over an existing pixel if the pixel life is{" "}
              {CONST_RULES.pixelMaximumUnitToOverride} units or less
            </li>
          </ul>
          <h1>Actions</h1>
          <ul>
            <li>Clicking a pixel: Select the pixel and opens the bottom panel</li>
            <li>Clicking a selected pixel: Unselect and closes the bottom panel</li>
            <li>Panning: Click, drag and release</li>
            <li>Zoom: Scrollwheel in and out</li>
          </ul>
        </div>
      </Portal>
    </div>
  );
}

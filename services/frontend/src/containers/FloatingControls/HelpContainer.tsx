import { createSignal, JSX } from "solid-js";
import { useControl } from "../../context/ControlContext";
import { useUserData } from "../../context/UserDataContext";
import styles from "./HelpContainer.module.css";
export interface HelpContainerProps {}
export function HelpContainer(props: HelpContainerProps): JSX.Element {
  const userData = useUserData();
  const [isOpen, setIsOpen] = createSignal(false);
  return (
    <div
      class={styles.HelpContainer}
      classList={{
        [styles.HelpContainerOpen]: isOpen(),
        [styles.ActionMenuOpen]: userData?.selectedCoordinate() !== undefined,
      }}
    >
      <button
        class={styles.HelpContainerButton}
        onMouseEnter={() => {
          setIsOpen(true);
        }}
        onMouseLeave={() => {
          setIsOpen(false);
        }}
      >
        <span class={styles.ShortText}>?</span>
        <span class={styles.LongText} classList={{ [styles.LongTextOpen]: isOpen() }}>
          Help
        </span>
      </button>
    </div>
  );
}

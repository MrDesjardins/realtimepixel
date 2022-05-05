import { createEffect, createSignal, JSX, on } from "solid-js";
import { useNotification } from "../../context/NotificationContext";
import { CONSTS } from "../../models/constants";
import styles from "./ToastNotification.module.css";

export function ToastNotification(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  const notification = useNotification();

  createEffect(
    on(notification?.message!, (message) => {
      if (message.length > 0) {
        setOpen(true);
        setTimeout(() => {
          close();
        }, CONSTS.notification.toastNotificationDurationMs);
      }
    }),
  );

  function close(): void {
    setOpen(false);
    notification?.setMessage("");
  }

  return (
    <div class={styles.ToastNotification} classList={{ [styles.ToastNotificationOpen]: open() }}>
      <button
        class={styles.ToastNotificationCloseButton}
        onClick={() => close()}
        title="Close the notification"
      >
        X
      </button>
      <p>{notification?.message}</p>
    </div>
  );
}

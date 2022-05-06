import { createEffect, createSignal, JSX, on } from "solid-js";
import { NotificationType, useNotification } from "../../context/NotificationContext";
import { CONSTS } from "../../models/constants";
import styles from "./ToastNotification.module.css";

export function ToastNotification(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  const notification = useNotification();

  createEffect(
    on(notification?.message!, (message) => {
      if ((message?.message ?? "").length > 0) {
        setOpen(true);
        setTimeout(() => {
          close();
        }, CONSTS.notification.toastNotificationDurationMs);
      }
    }),
  );

  function close(): void {
    setOpen(false);
    notification?.setMessage(undefined);
  }

  return (
    <div
      class={styles.ToastNotification}
      classList={{
        [styles.ToastNotificationOpen]: open(),
        [styles.ToastError]: notification?.message()?.type === NotificationType.Error,
      }}
    >
      <button
        class={styles.ToastNotificationCloseButton}
        onClick={() => close()}
        title="Close the notification"
      >
        X
      </button>
      <p>{notification?.message()?.message}</p>
    </div>
  );
}

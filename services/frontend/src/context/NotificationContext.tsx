import { JSX, createContext, createSignal, useContext, Accessor } from "solid-js";
export enum NotificationType {
  Info = "Info",
  Error = "Error",
}
export interface NotificationMessage {
  message: string;
  type: NotificationType;
}
export interface NotificationContextModel extends NotificationContextValues, NotificationContextActions {}
export interface NotificationContextValues {
  message: Accessor<NotificationMessage | undefined>;
}
export interface NotificationContextActions {
  setMessage: (message: NotificationMessage | undefined) => void;
}

export interface NotificationContextProps {
  children: JSX.Element;
}

export const NotificationContext = createContext<NotificationContextModel>();

export function NotificationProvider(props: NotificationContextProps) {
  const [message, setMessage] = createSignal<NotificationMessage | undefined>();

  const actions: NotificationContextModel = {
    setMessage: (message: NotificationMessage | undefined) => {
      setMessage(message);
    },
    message,
  };

  return <NotificationContext.Provider value={actions}>{props.children}</NotificationContext.Provider>;
}

export function useNotification(): NotificationContextModel | undefined {
  return useContext(NotificationContext);
}

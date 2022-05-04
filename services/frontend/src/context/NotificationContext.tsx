import { JSX, createContext, createSignal, useContext, Accessor } from "solid-js";

export interface NotificationContextModel extends NotificationContextValues, NotificationContextActions {}
export interface NotificationContextValues {
  message: Accessor<string>;
}
export interface NotificationContextActions {
  setMessage: (message: string) => void;
}

export interface NotificationContextProps {
  children: JSX.Element;
}

export const NotificationContext = createContext<NotificationContextModel>();

export function NotificationProvider(props: NotificationContextProps) {
  const [message, setMessage] = createSignal<string>("");

  const actions: NotificationContextModel = {
    setMessage: (message: string) => {
      setMessage(message);
    },
    message,
  };

  return <NotificationContext.Provider value={actions}>{props.children}</NotificationContext.Provider>;
}

export function useNotification(): NotificationContextModel | undefined {
  return useContext(NotificationContext);
}

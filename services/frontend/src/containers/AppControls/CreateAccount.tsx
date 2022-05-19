import { createSignal, JSX } from "solid-js";
import { HttpRequest } from "../../communications/httpRequest";
import { NotificationType, useNotification } from "../../context/NotificationContext";
import { useUserData } from "../../context/UserDataContext";
import styles from "./CreateAccount.module.css";
export interface CreateAccountProps {}
export function CreateAccount(props: CreateAccountProps): JSX.Element {
  const userData = useUserData();
  const notification = useNotification();
  const [emailCreate, setEmailCreate] = createSignal<string>("");
  const [passwordCreate, setPasswordCreate] = createSignal<string>("");
  const [isAuthenticating, setIsAuthenticating] = createSignal<boolean>(false);
  return (
    <div class={styles.CreateAccount}>
      <div class={styles.Create1}>
        <span>Email:</span>
        <input
          type="text"
          value={emailCreate()}
          onInput={(
            e: InputEvent & {
              currentTarget: HTMLInputElement;
              target: any;
            },
          ) => {
            setEmailCreate(e.target.value);
          }}
        />
      </div>
      <div class={styles.Create2}>
        <span>Password:</span>
        <input
          type="password"
          value={passwordCreate()}
          onInput={(
            e: InputEvent & {
              currentTarget: HTMLInputElement;
              target: any;
            },
          ) => {
            setPasswordCreate(e.target.value);
          }}
        />
        <button
          disabled={isAuthenticating()}
          onClick={async () => {
            setIsAuthenticating(true);
            const http = new HttpRequest();
            try {
              const response = await http.createUser({ email: emailCreate(), password: passwordCreate() });
              userData?.actions.setUserToken(response);
              notification?.setMessage({
                message: "You need to validatae your email",
                type: NotificationType.Info,
              });
            } catch (e: unknown) {
              if (e instanceof Error) {
                notification?.setMessage({ message: e.message, type: NotificationType.Error });
              }
            } finally {
              setIsAuthenticating(false);
            }
          }}
        >
          Create
        </button>
      </div>
    </div>
  );
}

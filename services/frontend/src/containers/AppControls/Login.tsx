import { createSignal, JSX } from "solid-js";
import { HttpRequest } from "../../communications/httpRequest";
import { useUserData } from "../../context/UserDataContext";
import styles from "./Login.module.css";
export interface LoginProps {}
export function Login(props: LoginProps): JSX.Element {
  const userData = useUserData();
  const [email, setEmail] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const [isAuthenticating, setIsAuthenticating] = createSignal<boolean>(false);
  return (
    <div class={styles.Login}>
      <div class={styles.Auth1}>
        <span>Email:</span>
        <input
          type="text"
          value={email()}
          onInput={(
            e: InputEvent & {
              currentTarget: HTMLInputElement;
              target: any;
            },
          ) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div class={styles.Auth2}>
        <span>Password:</span>
        <input
          type="password"
          value={password()}
          onInput={(
            e: InputEvent & {
              currentTarget: HTMLInputElement;
              target: any;
            },
          ) => {
            setPassword(e.target.value);
          }}
        />
        <button
          disabled={isAuthenticating()}
          onClick={async () => {
            setIsAuthenticating(true);
            const http = new HttpRequest();
            try {
              const response = await http.login({ email: email(), password: password() });
              userData?.actions.setUserToken(response.accessToken); // Temporary until we have real check
            } catch (e) {
              console.error(e); //Todo: log the error in a logging system
            } finally {
              setIsAuthenticating(false);
            }
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

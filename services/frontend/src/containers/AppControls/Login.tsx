import { createSignal, JSX } from "solid-js";
import { useUserData } from "../../context/UserDataContext";
import styles from "./Login.module.css";
export interface LoginProps {}
export function Login(props: LoginProps): JSX.Element {
  const userData = useUserData();
  const [email, setEmail] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
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
              target: Element;
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
              target: Element;
            },
          ) => {
            setPassword(e.target.value);
          }}
        />
        <button
          onClick={() => {
            userData?.setIsAuthenticated(true); // Temporary until we have real check
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

import { createSignal, JSX, Match, Show, Switch } from "solid-js";
import { CreateAccount } from "./CreateAccount";
import { Login } from "./Login";
import styles from "./LoginOrCreate.module.css";
export interface LoginOrCreateProps {}
export function LoginOrCreate(props: LoginOrCreateProps): JSX.Element {
  const [isLogin, setIsLogin] = createSignal<boolean | undefined>(undefined);
  return (
    <div class={styles.LoginOrCreate}>
      <Show when={isLogin() !== undefined}>
        <button
          class={styles.BackButton}
          onClick={() => {
            setIsLogin(undefined);
          }}
        >
          Back
        </button>
      </Show>
      <Switch
        fallback={
          <div class={styles.Choice}>
            <button
              onClick={() => {
                setIsLogin(true);
              }}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
              }}
            >
              Create a new Account
            </button>
          </div>
        }
      >
        <Match when={isLogin() === true}>
          <Login />
        </Match>
        <Match when={isLogin() === false}>
          <CreateAccount />
        </Match>
      </Switch>
    </div>
  );
}

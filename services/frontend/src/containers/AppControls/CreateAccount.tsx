import { createSignal, JSX } from "solid-js";
import styles from "./CreateAccount.module.css";
export interface CreateAccountProps {}
export function CreateAccount(props: CreateAccountProps): JSX.Element {
  const [emailCreate, setEmailCreate] = createSignal<string>("");
  const [passwordCreate, setPasswordCreate] = createSignal<string>("");
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
              target: Element;
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
              target: Element;
            },
          ) => {
            setPasswordCreate(e.target.value);
          }}
        />
        <button>Create</button>
      </div>
    </div>
  );
}

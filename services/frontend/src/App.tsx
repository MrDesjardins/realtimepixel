import type { Component } from "solid-js";
import styles from "./App.module.css";
import * as everything from "./gameboard";

const App: Component = () => {
  return <div id="app" class={styles.App}></div>;
};

export default App;

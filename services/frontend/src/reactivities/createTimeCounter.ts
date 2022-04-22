import { Accessor, createEffect, createSignal } from "solid-js";
import { CONSTS } from "../models/constants";

export function createTimeCounter(lastEpochTime: Accessor<EpochTimeStamp | undefined> | undefined): Accessor<number> {
  const [remaining, setRemaining] = createSignal<number>(0);

  setInterval(() => {
    const t = lastEpochTime?.();
    if (t === undefined) {
      setRemaining(0);
    } else {
      const now = new Date().getTime();
      const timeDiff = now - t;
      const elapsedSecondSinceLastMove = Math.ceil(timeDiff / 1000);
      const timeInSecondBeforeNextMove = CONSTS.gameRules.userPixelDelaySeconds - elapsedSecondSinceLastMove;
      setRemaining(timeInSecondBeforeNextMove < 0 ? 0 : timeInSecondBeforeNextMove);
    }
  }, 1000);
  return remaining;
}

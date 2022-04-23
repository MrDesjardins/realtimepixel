import { Accessor, createSignal } from "solid-js";
import { secondsUntilNextAction } from "@shared/logics/time";

export function createTimeCounter(
  lastEpochTime: Accessor<EpochTimeStamp | undefined> | undefined,
): Accessor<number> {
  const [remaining, setRemaining] = createSignal<number>(0);

  setInterval(() => {
    const lastEpoch = lastEpochTime?.();
    if (lastEpoch === undefined) {
      setRemaining(0);
    } else {
      const timeInSecondBeforeNextMove = secondsUntilNextAction(lastEpoch);
      setRemaining(timeInSecondBeforeNextMove < 0 ? 0 : timeInSecondBeforeNextMove);
    }
  }, 1000);
  return remaining;
}

import { Accessor, createSignal } from "solid-js";
import { secondsUntilNextAction } from "@shared/logics/time";

/**
 * Create a timer that return the remaining time
 *
 * @return A signal that cannot be under zero. Zero = ready for action. Undefined = no action allowed because didn't retrieve the last action
 */
export function createTimeCounter(
  lastEpochTime: Accessor<EpochTimeStamp | undefined> | undefined,
): Accessor<number | undefined> {
  const [remaining, setRemaining] = createSignal<number | undefined>(undefined);

  setInterval(() => {
    const lastEpoch = lastEpochTime?.();
    if (lastEpoch === undefined) {
      setRemaining(undefined);
    } else {
      const timeInSecondBeforeNextMove = secondsUntilNextAction(lastEpoch);
      setRemaining(timeInSecondBeforeNextMove < 0 ? 0 : timeInSecondBeforeNextMove);
    }
  }, 1000);
  return remaining;
}

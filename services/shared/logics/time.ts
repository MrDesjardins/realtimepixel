import { CONST_RULES } from "../constants/rules";

export function secondsUntilNextAction(lastEpochtime: EpochTimeStamp): number {
  const now = new Date().valueOf();
  const timeDiff = now - lastEpochtime;
  const elapsedSecondSinceLastMove = Math.ceil(timeDiff / 1000);
  const timeInSecondBeforeNextMove =
    CONST_RULES.userPixelDelaySeconds - elapsedSecondSinceLastMove;
  return timeInSecondBeforeNextMove;
}

export function isNextActionReadyForUser(
  lastEpochtime: EpochTimeStamp | undefined
): boolean {
  if (lastEpochtime === undefined) {
    return true;
  }
  return secondsUntilNextAction(lastEpochtime) <= 0;
}

import { CONST_RULES } from "../constants/rules";

export function secondsUntilNextAction(lastEpochtime: EpochTimeStamp): number {
  const now = new Date().getTime();
  const timeDiff = now - lastEpochtime;
  const elapsedSecondSinceLastMove = Math.ceil(timeDiff / 1000);
  const timeInSecondBeforeNextMove =
    CONST_RULES.userPixelDelaySeconds - elapsedSecondSinceLastMove;
  return timeInSecondBeforeNextMove;
}

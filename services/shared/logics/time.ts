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

export function getTileLife(
  currentEpochTimeMs: EpochTimeStamp,
  titleEpochTimeMs: EpochTimeStamp
): number {
  const life =
    CONST_RULES.pixelInitialLifeUnit -
    Math.floor(
      (currentEpochTimeMs - titleEpochTimeMs) /
        1000 /
        CONST_RULES.decayDelaySeconds
    );

  return life < 0 ? 0 : life;
}

export function getAlphaValue(
  currentEpochTimeMs: EpochTimeStamp,
  titleEpochTimeMs: EpochTimeStamp
): number {
  const MIN_ALPHA = 0.1;
  const life = getTileLife(currentEpochTimeMs, titleEpochTimeMs);
  if (life >= CONST_RULES.pixelMaximumUnitToOverride) {
    return 1; // Full opacity when life is above the threshold to override
  }
  const alpha =
    MIN_ALPHA + life / (CONST_RULES.pixelInitialLifeUnit - MIN_ALPHA);

  return alpha;
}

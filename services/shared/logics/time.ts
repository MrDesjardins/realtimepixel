import { CONST_RULES } from "../constants/rules";
import { Tile } from "../models/game";

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
  const MIN_ALPHA = 0.2;
  const life = getTileLife(currentEpochTimeMs, titleEpochTimeMs);
  if (life > CONST_RULES.pixelMaximumUnitToOverride) {
    return 1; // Full opacity when life is above the threshold to override
  }
  const alpha =
    MIN_ALPHA + life / (CONST_RULES.pixelInitialLifeUnit - MIN_ALPHA);

  return alpha;
}

export function isPixelAvailableForNewAction(
  existingTile: Tile | undefined,
  currentTime: EpochTimeStamp
): boolean {
  if (existingTile === undefined) {
    return true;
  }
  const tileLife = getTileLife(currentTime, existingTile.time);
  return tileLife <= CONST_RULES.pixelMaximumUnitToOverride;
}
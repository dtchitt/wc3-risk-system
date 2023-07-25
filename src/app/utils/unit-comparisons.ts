import { Options } from '../player/options';
import { PlayerManager } from '../player/player-manager';

export function CompareUnitByValue(compareUnit: unit, initialUnit: unit): unit {
	if (compareUnit == initialUnit) return initialUnit;

	const initialUnitValue: number = GetUnitPointValue(initialUnit);
	const compareUnitValue: number = GetUnitPointValue(compareUnit);
	const playerSettings: Options = PlayerManager.getInstance().players.get(GetOwningPlayer(compareUnit)).options;

	if (!playerSettings.value && compareUnitValue < initialUnitValue) {
		return compareUnit;
	}

	if (playerSettings.value && compareUnitValue > initialUnitValue) {
		return compareUnit;
	}

	if (compareUnitValue == initialUnitValue) {
		return CompareUnitByHealth(compareUnit, initialUnit, playerSettings);
	}

	return initialUnit;
}

export function CompareUnitByHealth(compareUnit: unit, initialUnit: unit, playerSettings: Options): unit {
	if (compareUnit == initialUnit) return initialUnit;

	const initialUnitValue: number = GetUnitState(initialUnit, UNIT_STATE_LIFE);
	const compareUnitValue: number = GetUnitState(compareUnit, UNIT_STATE_LIFE);

	if (!playerSettings.health && compareUnitValue < initialUnitValue) {
		return compareUnit;
	}

	if (playerSettings.health && compareUnitValue > initialUnitValue) {
		return compareUnit;
	}

	return initialUnit;
}

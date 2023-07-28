import { UNIT_TYPE } from '../utils/unit-types';
import { City } from './city';
import { Barracks } from './components/barracks';
import { Guard } from './components/guard';

export class LandCity extends City {
	public constructor(rax: Barracks, guard: Guard, cop: unit) {
		super(rax, guard, cop);
	}

	public isValidGuard(unit: unit): boolean {
		if (IsUnitType(unit, UNIT_TYPE.SHIP)) return false;
		if (!this.validGuardHandler(unit)) return false;

		return true;
	}

	public onUnitTrain(unit: unit): void {
		// TODO
		// Replace melee units with a ranged unit automatically.
		// Base it on unit value
		// Thus we need to rework compares so health is not always looked at.
	}

	public onCast(): void {
		if (IsUnitType(GetSpellTargetUnit(), UNIT_TYPE.SHIP)) return;
		if (IsUnitType(GetSpellTargetUnit(), UNIT_TYPE.GUARD)) return;

		this.castHandler();
		this.checkGuardDistance();
	}
}

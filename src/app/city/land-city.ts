import { UNIT_ID } from '../../configs/unit-id';
import { UNIT_TYPE } from '../utils/unit-types';
import { City } from './city';
import { Barracks } from './components/barracks';
import { Guard } from './components/guard';

export class LandCity extends City {
	public constructor(rax: Barracks, guard: Guard, cop: unit) {
		super(rax, guard, cop);
	}

	public isValidGuard(unit: unit): boolean {
		if (!UnitAlive(unit)) return false;
		if (IsUnitLoaded(unit)) return false;
		if (IsUnitType(unit, UNIT_TYPE_STRUCTURE)) return false;
		if (IsUnitType(unit, UNIT_TYPE.TRANSPORT)) return false;
		if (GetUnitTypeId(unit) == UNIT_ID.DUMMY_GUARD) return false;
		if (unit == null || unit == undefined) return false;
		if (IsUnitType(unit, UNIT_TYPE.GUARD) && unit != this.guard.unit) return false;
		if (IsUnitType(unit, UNIT_TYPE.SHIP)) return false;

		return true;
	}

	public onUnitTrain(unit: unit): void {
		// TODO
		// Replace melee units with a ranged unit automatically.
		// Base it on unit value
		// Thus we need to rework compares so health is not always looked at.
	}

	public onCast(): void {
		try {
			if (IsUnitType(GetSpellTargetUnit(), UNIT_TYPE.SHIP)) return;
			if (IsUnitType(GetSpellTargetUnit(), UNIT_TYPE.GUARD)) return;

			const targUnit: unit = GetSpellTargetUnit();
			const x: number = GetUnitX(targUnit);
			const y: number = GetUnitY(targUnit);
			const oldGuard: unit = this.guard.unit;

			this.guard.replace(targUnit);

			SetUnitPosition(oldGuard, x, y);

			this.guard.reposition();
		} catch (error) {
			print(error);
		}
	}
}

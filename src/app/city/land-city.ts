import { UNIT_ID } from 'src/configs/unit-id';
import { UNIT_TYPE } from '../utils/unit-types';
import { City } from './city';
import { UnitToCity } from './city-map';
import { Barracks } from './components/barracks';
import { Guard } from './components/guard';
import { IsUnitMelee } from '../utils/utils';

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
		if (IsUnitMelee(this.guard.unit) && GetUnitTypeId(unit) == UNIT_ID.RIFLEMEN) {
			SetUnitPosition(this.guard.unit, GetUnitX(unit), GetUnitY(unit));
			UnitToCity.delete(this.guard.unit);
			this.guard.replace(unit);
			UnitToCity.set(this.guard.unit, this);
			this.guard.reposition();
		}
	}

	public onCast(): void {
		if (IsUnitType(GetSpellTargetUnit(), UNIT_TYPE.SHIP)) return;
		if (IsUnitType(GetSpellTargetUnit(), UNIT_TYPE.GUARD)) return;

		this.castHandler();
		this.checkGuardDistance();
	}
}

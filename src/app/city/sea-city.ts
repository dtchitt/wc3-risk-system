import { UNIT_ID } from 'src/configs/unit-id';
import { TransportManager } from '../managers/transport-manager';
import { UNIT_TYPE } from '../utils/unit-types';
import { City } from './city';
import { UnitToCity } from './city-map';
import { Barracks } from './components/barracks';
import { Guard } from './components/guard';
import { IsUnitMelee } from '../utils/utils';

export class SeaCity extends City {
	public constructor(rax: Barracks, guard: Guard, cop: unit) {
		super(rax, guard, cop);
	}

	public isValidGuard(unit: unit): boolean {
		if (!this.validGuardHandler(unit)) return false;

		return true;
	}

	public onUnitTrain(unit: unit): void {
		if (IsUnitType(unit, UNIT_TYPE.TRANSPORT)) {
			TransportManager.getInstance().add(unit);
		}

		if (
			(IsUnitType(this.guard.unit, UNIT_TYPE.SHIP) && !IsUnitType(unit, UNIT_TYPE.SHIP)) ||
			(IsUnitMelee(this.guard.unit) && GetUnitTypeId(unit) == UNIT_ID.MARINE)
		) {
			SetUnitPosition(this.guard.unit, GetUnitX(unit), GetUnitY(unit));
			UnitToCity.delete(this.guard.unit);
			this.guard.replace(unit);
			UnitToCity.set(this.guard.unit, this);
			this.guard.reposition();
		}

		this.checkGuardDistance();
	}

	public onCast(): void {
		if (IsUnitType(GetSpellTargetUnit(), UNIT_TYPE.GUARD)) return;
		if (IsUnitType(GetSpellTargetUnit(), UNIT_TYPE.TRANSPORT)) return;

		this.castHandler();
		this.checkGuardDistance();
	}
}

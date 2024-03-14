import { UNIT_TYPE } from '../utils/unit-types';
import { City } from './city';
import { UnitToCity } from './city-map';
import { Barracks } from './components/barracks';
import { Guard } from './components/guard';
import { IsUnitMelee } from '../utils/utils';
import { DefaultGuardType } from 'src/configs/country-settings';

export class LandCity extends City {
	/**
	 * LandCity constructor.
	 * @param rax - The city's Barracks.
	 * @param guard - The city's Guard.
	 * @param cop - The city's Circle of Power.
	 */
	public constructor(rax: Barracks, guard: Guard, cop: unit) {
		super(rax, guard, cop);
	}

	/**
	 * Determines if a given unit is a valid guard for this city.
	 * The unit must not be a ship and must pass the `validGuardHandler` check.
	 * @param unit - The unit to check.
	 * @returns `true` if the unit is valid, `false` otherwise.
	 */
	public isValidGuard(unit: unit): boolean {
		if (IsUnitType(unit, UNIT_TYPE.SHIP)) return false;
		if (!this.validGuardHandler(unit)) return false;

		return true;
	}

	/**
	 * Handles the unit training event.
	 * If the city's guard is melee and the trained unit is a rifleman,
	 * the guard is replaced by the trained unit.
	 * @param unit - The trained unit.
	 */
	public onUnitTrain(unit: unit): void {
		if (IsUnitMelee(this.getGuard().getUnit()) && GetUnitTypeId(unit) == DefaultGuardType) {
			SetUnitPosition(unit, this.getGuard().getDefaultX(), this.getGuard().getDefaultY());
			UnitToCity.delete(this.getGuard().getUnit());
			this.getGuard().replace(unit);
			UnitToCity.set(this.getGuard().getUnit(), this);
			this.getGuard().reposition();
		}
	}

	/**
	 * Handles the casting event.
	 * If the targeted unit is not a ship or a guard, performs the casting actions.
	 */
	public onCast(): void {
		if (IsUnitType(GetSpellTargetUnit(), UNIT_TYPE.SHIP)) return;
		if (IsUnitType(GetSpellTargetUnit(), UNIT_TYPE.GUARD)) return;

		this.castHandler();
	}

	/**
	 * Checks if this city type is a port
	 */
	public isPort(): boolean {
		return false;
	}
}

import { UNIT_ID } from 'src/configs/unit-id';
import { UNIT_TYPE } from '../utils/unit-types';
import { City } from './city';
import { UnitToCity } from './city-map';
import { Barracks } from './components/barracks';
import { Guard } from './components/guard';
import { IsUnitMelee } from '../utils/utils';

export class PortCity extends City {
	/**
	 * SeaCity constructor.
	 * @param rax - The city's Barracks.
	 * @param guard - The city's Guard.
	 * @param cop - The city's Circle of Power.
	 */
	public constructor(rax: Barracks, guard: Guard, cop: unit) {
		super(rax, guard, cop);
	}

	/**
	 * Determines if a given unit is a valid guard for this city.
	 * The unit must pass the `validGuardHandler` check.
	 * @param unit - The unit to check.
	 * @returns `true` if the unit is valid, `false` otherwise.
	 */
	public isValidGuard(unit: unit): boolean {
		if (!this.validGuardHandler(unit)) return false;

		return true;
	}

	/**
	 * Handles the unit training event.
	 * If the trained unit is a transport, it is added to the TransportManager.
	 * If the city's guard is a ship and the trained unit is not, or if the guard is melee and the trained unit is a marine,
	 * the guard is replaced by the trained unit.
	 * @param unit - The trained unit.
	 */
	public onUnitTrain(unit: unit): void {
		//TODO
		// if (IsUnitType(unit, UNIT_TYPE.TRANSPORT)) {
		// 	TransportManager.getInstance().add(unit);
		// }

		if (
			(IsUnitType(this.getGuard().getUnit(), UNIT_TYPE.SHIP) && !IsUnitType(unit, UNIT_TYPE.SHIP)) ||
			(IsUnitMelee(this.getGuard().getUnit()) && GetUnitTypeId(unit) == UNIT_ID.MARINE)
		) {
			SetUnitPosition(unit, this.getGuard().getDefaultX(), this.getGuard().getDefaultY());
			UnitToCity.delete(this.getGuard().getUnit());
			this.getGuard().replace(unit);
			UnitToCity.set(this.getGuard().getUnit(), this);
			this.getGuard().reposition();
		}
	}

	/**
	 * Handles the casting event.
	 * If the targeted unit is not a guard or a transport, performs the casting actions.
	 */
	public onCast(): void {
		if (IsUnitType(GetSpellTargetUnit(), UNIT_TYPE.GUARD)) return;
		if (IsUnitType(GetSpellTargetUnit(), UNIT_TYPE.TRANSPORT)) return;

		this.castHandler();
	}

	/**
	 * Checks if this city type is a port
	 */
	public isPort(): boolean {
		return true;
	}
}

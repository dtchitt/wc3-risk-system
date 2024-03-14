import { Ownable } from '../interfaces/ownable';
import { Resetable } from '../interfaces/resetable';
import { NEUTRAL_HOSTILE } from '../utils/utils';
import { Barracks } from './components/barracks';
import { Guard } from './components/guard';
import { UnitToCity } from './city-map';
import { UNIT_TYPE } from '../utils/unit-types';
import { UNIT_ID } from 'src/configs/unit-id';

export abstract class City implements Resetable, Ownable {
	private owner: player;
	private barrack: Barracks;
	private guard: Guard;
	private cop: unit;

	/**
	 * @param rax The barracks for the city
	 * @param guard The guard for the city
	 * @param cop The Circle of Power for the city
	 */
	constructor(rax: Barracks, guard: Guard, cop: unit) {
		this.owner = NEUTRAL_HOSTILE;
		this.barrack = rax;
		this.guard = guard;
		this.cop = cop;
	}

	public abstract isValidGuard(unit: unit): boolean;
	public abstract onUnitTrain(unit: unit): void;
	public abstract onCast(): void;
	public abstract isPort(): boolean;

	/** Resets the city, returning it to its default state */
	public reset(): void {
		UnitToCity.delete(this.guard.getUnit());
		SetUnitOwner(this.cop, NEUTRAL_HOSTILE, true);
		this.owner = NEUTRAL_HOSTILE;
		this.barrack.reset();
		this.guard.reset();
		UnitToCity.set(this.guard.getUnit(), this);
	}

	/**
	 * @param player The player to set as the city's owner
	 */
	public setOwner(player: player): void {
		this.owner = player;
		this.barrack.setOwner(player);
		SetUnitOwner(this.cop, player, true);
	}

	/**
	 * @param newOwner The new owner of the city
	 */
	public changeOwner(newOwner: player): void {
		this.setOwner(newOwner);
		IssuePointOrder(this.barrack.getUnit(), 'setrally', this.barrack.getDefaultX() - 70, this.barrack.getDefaultY() - 155);
	}

	/** @returns The current owner of the city */
	public getOwner(): player {
		return this.owner;
	}

	/** @returns The Barracks object of the city */
	public getBarrack(): Barracks {
		return this.barrack;
	}

	/** @returns The Circle of Power of the city */
	public getCop(): unit {
		return this.cop;
	}

	/** @returns The Guard object of the city */
	public getGuard(): Guard {
		return this.guard;
	}

	/**
	 * @param value The new guard for the city
	 */
	public setGuard(value: Guard) {
		this.guard = value;
	}

	/**
	 * A helper method to determine if a given unit is a valid guard.
	 * The guard must be alive, not loaded, not a structure or transport,
	 * and should not be the same unit as the city's current guard.
	 * @param unit - The unit to check.
	 * @returns `true` if the unit is valid, `false` otherwise.
	 */
	protected validGuardHandler(unit: unit): boolean {
		if (!UnitAlive(unit)) return false;
		if (IsUnitLoaded(unit)) return false;
		if (IsUnitType(unit, UNIT_TYPE_STRUCTURE)) return false;
		if (IsUnitType(unit, UNIT_TYPE.TRANSPORT)) return false;
		if (GetUnitTypeId(unit) == UNIT_ID.DUMMY_GUARD) return false;
		if (unit == null || unit == undefined) return false;
		if (IsUnitType(unit, UNIT_TYPE.GUARD) && unit != this.guard.getUnit()) return false;

		return true;
	}

	/**
	 * A handler method for the casting event.
	 * It changes the city's guard to the unit targeted by the spell,
	 * and repositions the old guard to the location of the targeted unit.
	 */
	protected castHandler() {
		const targUnit: unit = GetSpellTargetUnit();
		const x: number = GetUnitX(targUnit);
		const y: number = GetUnitY(targUnit);
		const oldGuard: unit = this.guard.getUnit();

		UnitToCity.delete(this.guard.getUnit());
		this.guard.replace(targUnit);
		UnitToCity.set(this.guard.getUnit(), this);
		SetUnitPosition(oldGuard, x, y);
		this.guard.reposition();

		const newOwner: player = GetOwningPlayer(this.guard.getUnit());

		if (this.owner != newOwner) {
			this.setOwner(newOwner);
		}
	}
}

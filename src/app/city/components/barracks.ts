import { Ownable } from 'src/app/interfaces/ownable';
import { Resetable } from 'src/app/interfaces/resetable';
import { NEUTRAL_HOSTILE } from 'src/app/utils/utils';

export class Barracks implements Resetable, Ownable {
	private readonly unit: unit;
	private readonly unitType: number;
	private readonly defaultX: number;
	private readonly defaultY: number;

	/**
	 * Constructs a new Barracks object.
	 * @param unit - The unit to base the barracks on.
	 */
	constructor(unit: unit) {
		this.unit = unit;
		this.unitType = GetUnitTypeId(unit);
		this.defaultX = GetUnitX(unit);
		this.defaultY = GetUnitY(unit);
	}

	/** @returns The unit object that represents the barracks. */
	public getUnit(): unit {
		return this.unit;
	}

	/** @returns The identifier of the unit type for the barracks. */
	public getUnitType(): number {
		return this.unitType;
	}

	/** @returns The default X coordinate of the barracks on the map. */
	public getDefaultX(): number {
		return this.defaultX;
	}

	/** @returns The default Y coordinate of the barracks on the map. */
	public getDefaultY(): number {
		return this.defaultY;
	}

	/**
	 * Resets the unit owner to NEUTRAL_HOSTILE.
	 */
	public reset(): void {
		SetUnitOwner(this.unit, NEUTRAL_HOSTILE, true);
		SetUnitRallyUnit(this.unit, this.unit);
	}

	/**
	 * Sets the owner of the unit.
	 * @param player - The player object that will become the new owner.
	 */
	public setOwner(player: player): void {
		SetUnitOwner(this.unit, player, true);
	}

	/**
	 * Gets the owner of the unit.
	 * @returns The player object representing the owner.
	 */
	public getOwner(): player {
		return GetOwningPlayer(this.unit);
	}
}

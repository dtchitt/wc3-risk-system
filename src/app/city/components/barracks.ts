import { Ownable } from 'src/app/interfaces/ownable';
import { Resetable } from 'src/app/interfaces/resetable';
import { NEUTRAL_HOSTILE } from 'src/app/utils/utils';

export class Barracks implements Resetable, Ownable {
	private _unit: unit;
	private readonly _unitType: number;
	private readonly _defaultX: number;
	private readonly _defaultY: number;

	/**
	 * Constructs a new Barracks object.
	 * @param unit - The unit to base the barracks on.
	 */
	constructor(unit: unit) {
		this._unit = unit;
		this._unitType = GetUnitTypeId(unit);
		this._defaultX = GetUnitX(unit);
		this._defaultY = GetUnitY(unit);
	}

	/** @returns The unit object that represents the barracks. */
	public get unit(): unit {
		return this._unit;
	}

	/** @returns The identifier of the unit type for the barracks. */
	public get unitType(): number {
		return this._unitType;
	}

	/** @returns The default X coordinate of the barracks on the map. */
	public get defaultX(): number {
		return this._defaultX;
	}

	/** @returns The default Y coordinate of the barracks on the map. */
	public get defaultY(): number {
		return this._defaultY;
	}

	/**
	 * Resets the unit owner to NEUTRAL_HOSTILE.
	 */
	public reset(): void {
		SetUnitOwner(this._unit, NEUTRAL_HOSTILE, true);
		SetUnitRallyUnit(this._unit, this._unit);
	}

	/**
	 * Sets the owner of the unit.
	 * @param player - The player object that will become the new owner.
	 */
	public setOwner(player: player): void {
		SetUnitOwner(this._unit, player, true);
	}

	/**
	 * Gets the owner of the unit.
	 * @returns The player object representing the owner.
	 */
	public getOwner(): player {
		return GetOwningPlayer(this._unit);
	}
}

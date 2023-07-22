import { UNIT_ID } from 'src/configs/unit-id';
import { UNIT_TYPE } from 'src/app/utils/unit-types';
import { NEUTRAL_HOSTILE } from 'src/app/utils/utils';
import { Resetable } from 'src/app/libs/resetable';

export class Guard implements Resetable {
	private _unit: unit;
	private readonly unitType: number;
	private readonly _defaultX: number;
	private readonly _defaultY: number;

	constructor(guardData: number, x: number, y: number) {
		this._defaultX = x;
		this._defaultY = y;
		this.unitType = guardData;
		this.build();
	}

	/**
	 * Returns the handle of the guard unit
	 */
	public get unit(): unit {
		return this._unit;
	}

	/**
	 * Returns the default X position of this guard
	 */
	public get defaultX(): number {
		return this._defaultX;
	}

	/**
	 * Returns the default Y position of this guard
	 */
	public get defaultY(): number {
		return this._defaultY;
	}

	/**
	 * Sets a unit as the guard.
	 * @param guard Unit to become the guard.
	 */
	public set(guard: unit): void {
		if (GetUnitTypeId(this._unit) == UNIT_ID.DUMMY_GUARD) {
			this.remove();
		}

		this._unit = guard;
		UnitAddType(this._unit, UNIT_TYPE.GUARD);
	}

	/**
	 * Releases the current guard.
	 * Removes all guard attributes and references to this unit.
	 */
	public release(): void {
		if (this._unit == null) return;

		UnitRemoveType(this._unit, UNIT_TYPE.GUARD);
		this._unit = null;
	}

	/**
	 * Removes the current guard from the game.
	 */
	public remove(): void {
		RemoveUnit(this._unit);
		this._unit = null;
	}

	/**
	 * Resets this guard as if its a new game.
	 */
	public reset(): void {
		this.remove();
		this.build();
	}

	/**
	 * Sets the guard to its default position
	 */
	public reposition(): void {
		SetUnitPosition(this.unit, this._defaultX, this._defaultY);
	}

	/**
	 * Replaces the current guard with the provided unit
	 * @param guard The new guard
	 */
	public replace(guard: unit): void {
		if (GetUnitTypeId(this._unit) == UNIT_ID.DUMMY_GUARD) {
			this.remove();
		} else {
			this.release();
		}

		this.set(guard);
		this.reposition();
	}

	/**
	 * Create a new guard based on defaults.
	 */
	private build(): void {
		this.set(CreateUnit(NEUTRAL_HOSTILE, this.unitType, this._defaultX, this._defaultY, 270));
	}
}

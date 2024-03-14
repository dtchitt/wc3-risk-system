import { UNIT_ID } from 'src/configs/unit-id';
import { UNIT_TYPE } from 'src/app/utils/unit-types';
import { NEUTRAL_HOSTILE } from 'src/app/utils/utils';
import { Resetable } from 'src/app/interfaces/resetable';

export class Guard implements Resetable {
	private unit: unit;
	private readonly unitType: number;
	private readonly defaultX: number;
	private readonly defaultY: number;

	/**
	 * Constructs a new Guard object.
	 * @param guardData - The data for the type of guard.
	 * @param x - The default X coordinate for the guard on the map.
	 * @param y - The default Y coordinate for the guard on the map.
	 */
	constructor(guardData: number, x: number, y: number) {
		this.defaultX = x;
		this.defaultY = y;
		this.unitType = guardData;
		this.build();
	}

	/** @returns The unit object that represents the guard. */
	public getUnit(): unit {
		return this.unit;
	}

	/** @returns The default X coordinate of the guard on the map. */
	public getDefaultX(): number {
		return this.defaultX;
	}

	/** @returns The default Y coordinate of the guard on the map. */
	public getDefaultY(): number {
		return this.defaultY;
	}

	/**
	 * Sets the guard unit and adds the guard type to it.
	 * @param guard - The unit object that will become the new guard.
	 */
	public set(guard: unit): void {
		if (GetUnitTypeId(this.unit) == UNIT_ID.DUMMY_GUARD) {
			this.remove();
		}

		this.unit = guard;
		UnitAddType(this.unit, UNIT_TYPE.GUARD);
	}

	/**
	 * Releases the guard, removing the guard type and setting the unit to null.
	 */
	public release(): void {
		if (this.unit == null) return;

		UnitRemoveType(this.unit, UNIT_TYPE.GUARD);
		this.unit = null;
	}

	/**
	 * Removes the guard unit from the game entirely.
	 */
	public remove(): void {
		RemoveUnit(this.unit);
		this.unit = null;
	}

	/**
	 * Resets the guard unit by removing it and then rebuilding it.
	 */
	public reset(): void {
		this.remove();
		this.build();
	}

	/**
	 * Repositions the guard to its default coordinates.
	 */
	public reposition(): void {
		SetUnitPosition(this.unit, this.defaultX, this.defaultY);
	}

	/**
	 * Replaces the current guard with a new one, and repositions it as necessary.
	 * @param guard - The new guard unit.
	 */
	public replace(guard: unit): void {
		if (GetUnitTypeId(this.unit) == UNIT_ID.DUMMY_GUARD) {
			this.remove();
		} else {
			this.release();
		}

		this.set(guard);
		this.reposition();
	}

	/**
	 * Builds the guard unit by creating it with the specified type and default coordinates.
	 */
	private build(): void {
		this.set(CreateUnit(NEUTRAL_HOSTILE, this.unitType, this.defaultX, this.defaultY, 270));
	}
}

import { UNIT_ID } from '../../configs/unit-id';
import { Ownable } from '../interfaces/ownable';
import { Resetable } from '../interfaces/resetable';
import { UNIT_TYPE } from '../utils/unit-types';
import { NEUTRAL_HOSTILE } from '../utils/utils';

export const SPANWER_UNITS: Map<unit, Spawner> = new Map<unit, Spawner>();

export class Spawner implements Resetable, Ownable {
	private unit: unit;
	private country: string;
	private spawnsPerStep: number;
	private maxSpawnsPerPlayer: number;
	private spawnMap: Map<player, unit[]>;
	private spawnType: number;

	/**
	 * Spawner constructor.
	 * @param {unit} unit - The unit associated with the spawner.
	 * @param {string} countryName - The name of the country where the spawner is located.
	 * @param {number} spawnsPerStep - The number of units spawned per step.
	 * @param {number} spawnsPerPlayer - The number of units spawned per player.
	 * @param {number} spawnTypdID - The type ID of the spawn.
	 */
	public constructor(unit: unit, countryName: string, spawnsPerStep: number, spawnsPerPlayer: number, spawnTypdID: number) {
		this.unit = unit;
		this.country = countryName;
		this.spawnsPerStep = spawnsPerStep;
		this.maxSpawnsPerPlayer = spawnsPerPlayer;
		this.spawnType = spawnTypdID;
		this.spawnMap = new Map<player, unit[]>();
		this.setName();
	}

	/** @returns The unit associated with the spawner. */
	public getUnit(): unit {
		return this.unit;
	}

	/**
	 * Executes a step for the spawner, creating new units if conditions are met.
	 */
	public step() {
		if (this.getOwner() == NEUTRAL_HOSTILE) return;
		if (GetPlayerSlotState(this.getOwner()) != PLAYER_SLOT_STATE_PLAYING) return;

		const spawnCount: number = this.spawnMap.get(this.getOwner()).length;

		if (spawnCount >= this.maxSpawnsPerPlayer) return;

		const amount: number = Math.min(this.spawnsPerStep, this.maxSpawnsPerPlayer - spawnCount);

		for (let i = 0; i < amount; i++) {
			let u: unit = CreateUnit(this.getOwner(), this.spawnType, GetUnitX(this.unit), GetUnitY(this.unit), 270);
			let loc: location = GetUnitRallyPoint(this.unit);

			UnitAddType(u, UNIT_TYPE.SPAWN);
			this.spawnMap.get(this.getOwner()).push(u);
			SPANWER_UNITS.set(u, this);
			IssuePointOrderLoc(u, 'attack', loc);

			RemoveLocation(loc);
			loc = null;
			u = null;
		}

		this.setName();
	}

	/**
	 * Resets the spawner to its initial state.
	 */
	public reset() {
		const x: number = GetUnitX(this.unit);
		const y: number = GetUnitY(this.unit);

		this.spawnMap.clear();
		RemoveUnit(this.unit);
		this.unit = null;

		this.rebuild(x, y);
		this.setName();
	}

	/**
	 * Sets the owner of the spawner.
	 * @param {player} player - The player to set as owner.
	 */
	public setOwner(player: player): void {
		if (player == null) player = NEUTRAL_HOSTILE;

		SetUnitOwner(this.unit, player, true);

		if (!this.spawnMap.has(this.getOwner())) {
			this.spawnMap.set(this.getOwner(), []);
		}

		this.setName();
		IssuePointOrder(this.unit, 'setrally', GetUnitX(this.unit), GetUnitY(this.unit));
	}

	/** @returns The player that owns the spawner. */
	public getOwner(): player {
		return GetOwningPlayer(this.unit);
	}

	/**
	 * Handles the death of a unit associated with the spawner.
	 * @param {player} player - The player owning the deceased unit.
	 * @param {unit} unit - The deceased unit.
	 */
	public onDeath(player: player, unit: unit): void {
		const index = this.spawnMap.get(player).indexOf(unit);

		this.spawnMap.get(player).splice(index, 1);

		SPANWER_UNITS.delete(unit);

		this.setName();
	}

	/**
	 * Sets the name of the spawner based on its current state.
	 */
	private setName(): void {
		if (GetOwningPlayer(this.unit) == NEUTRAL_HOSTILE) {
			BlzSetUnitName(this.unit, `${this.country} is unowned`);
			SetUnitAnimation(this.unit, 'death');
		} else {
			const spawnCount: number = this.spawnMap.get(this.getOwner()).length;

			BlzSetUnitName(this.unit, `${this.country}  ${spawnCount} / ${this.maxSpawnsPerPlayer}`);
			SetUnitAnimation(this.unit, 'stand');
		}
	}

	/**
	 * Rebuilds the spawner at a given location.
	 * @param {number} x - The x coordinate for the spawner.
	 * @param {number} y - The y coordinate for the spawner.
	 */
	private rebuild(x: number, y: number) {
		this.unit = CreateUnit(NEUTRAL_HOSTILE, UNIT_ID.SPAWNER, x, y, 270);
		SetUnitPathing(this.unit, false);
	}
}

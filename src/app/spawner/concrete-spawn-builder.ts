import { SpawnTurnLimit } from 'src/configs/country-settings';
import { NEUTRAL_HOSTILE } from '../utils/utils';
import { Spawner } from './spawner';
import { SpawnerBuilder } from './spawner-builder';
import { UNIT_ID } from '../../configs/unit-id';
import { Coordinates } from '../interfaces/coordinates';

export class ConcreteSpawnerBuilder implements SpawnerBuilder {
	private unit: unit;
	private country: string;
	private spawnsPerStep: number;
	private maxSpawnsPerPlayer: number;
	private spawnTypeID: number;

	public setUnit(unitData: unit | Coordinates): SpawnerBuilder {
		if (typeof unitData === 'object') {
			const data: Coordinates = unitData as Coordinates;
			this.unit = CreateUnit(NEUTRAL_HOSTILE, UNIT_ID.SPAWNER, data.x, data.y, 270);
		} else {
			this.unit = unitData;
		}

		SetUnitPathing(this.unit, false);

		return this;
	}

	public setCountry(countryName: string): SpawnerBuilder {
		this.country = countryName;

		return this;
	}

	public setSpawnsPerStep(spawnsPerStep: number): SpawnerBuilder {
		this.spawnsPerStep = spawnsPerStep;

		return this;
	}

	public setMaxSpawnPerPlayer(spawnsPerPlayer?: number): SpawnerBuilder {
		if (!spawnsPerPlayer) {
			this.maxSpawnsPerPlayer = this.spawnsPerStep * SpawnTurnLimit;
		} else {
			this.maxSpawnsPerPlayer = spawnsPerPlayer;
		}

		return this;
	}

	public setSpawnType(spawnTypeID: number): SpawnerBuilder {
		this.spawnTypeID = spawnTypeID;

		return this;
	}

	public build(): Spawner {
		if (!this.unit || !this.country || !this.spawnsPerStep || !this.maxSpawnsPerPlayer || !this.spawnTypeID) {
			print('Spawner builder is missing required components.');
		}

		const spawner = new Spawner(this.unit, this.country, this.spawnsPerStep, this.maxSpawnsPerPlayer, this.spawnTypeID);

		this.reset();

		return spawner;
	}

	public reset(): void {
		this.unit = null;
		this.country = null;
		this.spawnsPerStep = null;
		this.maxSpawnsPerPlayer = null;
	}
}

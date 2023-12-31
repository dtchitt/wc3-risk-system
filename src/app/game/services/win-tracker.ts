import { PLAYER_COLOR_CODES_MAP } from 'src/app/utils/player-colors';
import { PLAYER_SLOTS } from 'src/app/utils/utils';

interface EntityData {
	entity: player;
	wins: number;
	identifier: string;
}

export class WinTracker {
	private entityData: Map<player, EntityData>;
	private currentLeader: player;

	public constructor() {
		this.entityData = new Map<player, EntityData>();

		const entityList: player[] = [];

		for (let i = 0; i < PLAYER_SLOTS; i++) {
			const player = Player(i);

			if (IsPlayerObserver(player)) continue;

			if (GetPlayerSlotState(player) == PLAYER_SLOT_STATE_PLAYING) {
				entityList.push(player);
			}
		}

		entityList.forEach((entity) => {
			this.entityData.set(entity, {
				entity: entity,
				wins: 0,
				identifier: PLAYER_COLOR_CODES_MAP.get(GetPlayerColor(entity)),
			});
		});

		this.currentLeader = entityList[0];
	}

	public addWinForEntity(entity: player) {
		const entityData = this.entityData.get(entity);

		entityData.wins++;
		this.updateCurrentLeader(entity);
		this.updateUI();
	}

	public getEntityWithMostWins(): player {
		let entities = Array.from(this.entityData.values());

		if (entities[0].wins === entities[1].wins) {
			return this.currentLeader;
		}

		return entities[0].wins > entities[1].wins ? entities[0].entity : entities[1].entity;
	}

	private updateUI() {
		const mapInfo: framehandle = BlzGetFrameByName('mapInfo', 0);
		const leader: EntityData = this.entityData.get(this.currentLeader);
		let otherEntity: EntityData;

		this.entityData.forEach((entityData, entity) => {
			if (entity != this.currentLeader) {
				otherEntity = this.entityData.get(entity);
			}
		});

		let newMapInfoString: string = `${leader.identifier}${leader.wins}|r - ${otherEntity.identifier}${otherEntity.wins}|r`;

		BlzFrameSetText(mapInfo, newMapInfoString);
	}

	private updateCurrentLeader(entity: player) {
		const leaderData = this.entityData.get(this.currentLeader);
		const entityData = this.entityData.get(entity);

		if (entityData && leaderData && entityData.wins > leaderData.wins) {
			this.currentLeader = entity;
		}
	}
}

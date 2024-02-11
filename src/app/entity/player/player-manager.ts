import { ABILITY_ID } from 'src/configs/ability-id';
import { UNIT_ID } from 'src/configs/unit-id';
import { GamePlayer } from './game-player';

export class PlayerManager {
	private gamePlayers: Map<player, GamePlayer>;
	private observers: Set<player>;

	private static _instance: PlayerManager;

	private constructor() {
		this.gamePlayers = new Map<player, GamePlayer>();
		this.observers = new Set<player>();

		for (let i = 0; i < bj_MAX_PLAYERS; i++) {
			const player = Player(i);

			if (GetPlayerSlotState(player) == PLAYER_SLOT_STATE_LEFT) continue;
			if (GetPlayerSlotState(player) == PLAYER_SLOT_STATE_EMPTY) continue;

			if (GetPlayerController(player) == MAP_CONTROL_USER || GetPlayerController(player) == MAP_CONTROL_COMPUTER) {
				if (IsPlayerObserver(player)) {
					this.observers.add(player);
					continue;
				} else {
					this.gamePlayers.set(player, new GamePlayer(player));
				}

				const tools: unit = CreateUnit(player, UNIT_ID.PLAYER_TOOLS, 18750.0, -16200.0, 270);

				SetUnitPathing(tools, false);
				UnitRemoveAbility(tools, ABILITY_ID.LOW_HEALTH_DEFENDER);
				UnitRemoveAbility(tools, ABILITY_ID.LOW_VALUE_DEFENDER);
			}
		}
	}

	public static getInstance(): PlayerManager {
		if (this._instance == null) {
			this._instance = new PlayerManager();
		}

		return this._instance;
	}

	public getPlayerMap(): Map<player, GamePlayer> {
		return this.gamePlayers;
	}

	public getObservers(): Set<player> {
		return this.observers;
	}
}

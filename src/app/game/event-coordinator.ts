import { GameMode } from './game-mode/state/game-mode';
import { City } from '../city/city';
import { ActivePlayer } from '../player/types/active-player';
import { EventEmitter } from '../utils/events/event-emitter';
import {
	EVENT_ON_REMATCH,
	EVENT_ON_IN_PROGRESS,
	EVENT_ON_CITY_CAPTURE,
	EVENT_ON_PLAYER_ALIVE,
	EVENT_ON_PLAYER_DEAD,
	EVENT_ON_PLAYER_FORFEIT,
	EVENT_ON_PLAYER_LEFT,
	EVENT_ON_PLAYER_NOMAD,
	EVENT_ON_PLAYER_STFU,
	EVENT_ON_UNIT_KILLED,
	EVENT_ON_POST_MATCH,
	EVENT_ON_PRE_MATCH,
	EVENT_SET_GAME_MODE,
	EVENT_ON_START_MATCH,
	EVENT_START_GAME_LOOP,
	EVENT_ON_END_MATCH,
	EVENT_ON_CITY_SELECTED,
	EVENT_QUEST_UPDATE_PLAYER_STATUS,
	EVENT_ON_SETUP_MATCH,
} from '../utils/events/event-constants';
import { StandardGameMode } from './game-mode/game-mode/standard-game-mode';
import { GameType } from '../settings/strategies/game-type-strategy';
import { CapitalsGameMode } from './game-mode/game-mode/capitals-game-mode';
import { Quests } from '../quests/quests';

export class EventCoordinator {
	private static instance: EventCoordinator;
	private _gameMode: GameMode;
	private _matchLoopTimer: timer;

	private constructor() {
		this.registerEvents();
	}

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new EventCoordinator();
		}

		return this.instance;
	}

	private registerEvents() {
		EventEmitter.getInstance().on(EVENT_ON_PLAYER_ALIVE, (player: ActivePlayer) => this._gameMode.onPlayerAlive(player));
		EventEmitter.getInstance().on(EVENT_ON_PLAYER_DEAD, (player: ActivePlayer) => this._gameMode.onPlayerDead(player));
		EventEmitter.getInstance().on(EVENT_ON_PLAYER_LEFT, (player: ActivePlayer) => this._gameMode.onPlayerLeft(player));
		EventEmitter.getInstance().on(EVENT_ON_PLAYER_NOMAD, (player: ActivePlayer) => this._gameMode.onPlayerNomad(player));
		EventEmitter.getInstance().on(EVENT_ON_PLAYER_STFU, (player: ActivePlayer) => this._gameMode.onPlayerSTFU(player));
		EventEmitter.getInstance().on(EVENT_ON_PLAYER_FORFEIT, (player: ActivePlayer) => this._gameMode.onPlayerForfeit(player));
		EventEmitter.getInstance().on(EVENT_ON_CITY_CAPTURE, (city: City, preOwner: ActivePlayer, owner: ActivePlayer) =>
			this._gameMode.onCityCapture(city, preOwner, owner)
		);
		EventEmitter.getInstance().on(EVENT_ON_UNIT_KILLED, (killingUnit: unit, dyingUnit: unit) =>
			this._gameMode.onUnitKilled(killingUnit, dyingUnit)
		);

		EventEmitter.getInstance().on(EVENT_ON_CITY_SELECTED, (city: City, player: player) => this._gameMode.onCitySelected(city, player));

		EventEmitter.getInstance().on(EVENT_ON_SETUP_MATCH, () => this._gameMode.onSetupMatch());
		EventEmitter.getInstance().on(EVENT_ON_START_MATCH, () => this._gameMode.onStartMatch());
		EventEmitter.getInstance().on(EVENT_ON_REMATCH, () => this._gameMode.onRematch());
		EventEmitter.getInstance().on(EVENT_SET_GAME_MODE, (gameType: GameType) => this.applyGameMode(gameType));

		EventEmitter.getInstance().on(EVENT_ON_PRE_MATCH, () => this._gameMode.onPreMatch());
		EventEmitter.getInstance().on(EVENT_ON_IN_PROGRESS, () => this._gameMode.onInProgress());
		EventEmitter.getInstance().on(EVENT_ON_POST_MATCH, () => this._gameMode.onPostMatch());
		EventEmitter.getInstance().on(EVENT_ON_END_MATCH, () => this._gameMode.onEndMatch());

		EventEmitter.getInstance().on(EVENT_START_GAME_LOOP, () => this.startGameLoop());

		EventEmitter.getInstance().on(EVENT_QUEST_UPDATE_PLAYER_STATUS, () => Quests.getInstance().UpdateShuffledPlayerListQuest());
	}

	public applyGameMode(gameType: GameType) {
		this._gameMode = gameType === 'Standard' ? new StandardGameMode() : new CapitalsGameMode();
	}
}

import { ActivePlayer } from '../player/types/active-player';
import { MatchGameLoop } from './match-game-loop';
import { GameState } from './state/game-state';
import { MatchData } from './state/match-state';

export class GameManager {
	private _state: GameState;
	private _gameLoop: MatchGameLoop;

	private _restartEnabled: boolean;

	private static instance: GameManager;

	private constructor() {
		MatchData.matchState = 'modeSelection';
		this._gameLoop = MatchGameLoop.getInstance();
	}

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new GameManager();
		}

		return this.instance;
	}

	public startGameMode() {
		print('startGameMode');
		MatchData.matchState = 'preMatch';
		this._gameLoop.startGameMode();
	}

	public updateState(state: GameState) {
		this._state = state;
		this._state.setObserver(this);
		this._state.run();
	}

	public static isMatchInProgress() {
		return MatchData.matchState == 'inProgress';
	}

	public static isMatchPostStage() {
		return MatchData.matchState == 'postMatch';
	}

	public isRestartEnabled() {
		return this._restartEnabled;
	}

	public setRestartEnabled(bool: boolean) {
		this._restartEnabled = bool;
	}

	public fastRestart() {
		this._gameLoop.startGameMode().then();
	}

	public fullRestart() {
		// ModeSelection.getInstance().run();
	}

	public get getGameState(): GameState {
		return this._state;
	}

	// public addPlayer(player: ActivePlayer) {
	// 	MatchData.players.push(player);

	// 	if (!MatchData.leader) {
	// 		MatchData.leader = player;
	// 	}
	// }

	// public removePlayer(player: ActivePlayer) {
	// 	const index: number = MatchData.players.indexOf(player);

	// 	if (index > -1) {
	// 		MatchData.players.splice(index, 1);
	// 	}

	// 	if (MatchData.players.length == 1) {
	// 		MatchData.leader = MatchData.players[0];
	// 		return true;
	// 	}

	// 	this._gameLoop.onPlayerElimination(player);
	// }

	public onPlayerElimination(player: ActivePlayer) {}

	public setLeader(player: ActivePlayer) {
		if (player.trackedData.cities.cities.length > MatchData.leader.trackedData.cities.cities.length) {
			MatchData.leader = player;
		}
	}
}

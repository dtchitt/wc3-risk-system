import { ActivePlayer } from '../player/types/active-player';
import { MatchGameLoop } from './match-game-loop';
import { GameMode } from './game-mode/game-mode';
import { GameState } from './state/game-state';
import { ModeSelection } from './state/mode-selection';

export class GameManager {
	private _round: number;
	private _gameState: GameState = 'preGame';
	private _modeSelectionState: ModeSelection;
	private _gameLoop: MatchGameLoop;

	private _restartEnabled: boolean;

	private _leader: ActivePlayer;
	private players: ActivePlayer[];

	private static instance: GameManager;

	private constructor() {
		this._round = 1;
		this._gameState = 'preGame';
		this._modeSelectionState = new ModeSelection();
		// this.startGameMode();
	}

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new GameManager();
		}

		return this.instance;
	}

	public startGameMode(gameMode: GameMode) {
		MatchGameLoop.getInstance().setGameMode(gameMode);
		this._gameState = 'inProgress';
		MatchGameLoop.getInstance().startGameMode();
	}

	public isStateMetaGame() {
		return this._gameState == 'preGame';
	}

	public isStatePostGame() {
		return this._gameState == 'postGame';
	}

	public isRestartEnabled() {
		return this._restartEnabled;
	}

	public setRestartEnabled(bool: boolean) {
		this._restartEnabled = bool;
	}

	public fastRestart() {
		// this.startGameMode(this.preGameState);
	}

	public fullRestart() {
		// this.startGameMode(this.modeSelectionState);
	}

	public get round(): number {
		return this._round;
	}

	public get gameState(): GameState {
		return this._gameState;
	}

	public get leader(): ActivePlayer {
		return this._leader;
	}

	public get matchPlayers(): ActivePlayer[] {
		return this.players;
	}

	public addPlayer(player: ActivePlayer) {
		this.players.push(player);

		if (!this._leader) {
			this._leader = player;
		}
	}

	public removePlayer(player: ActivePlayer) {
		const index: number = this.players.indexOf(player);

		if (index > -1) {
			this.players.splice(index, 1);
		}

		if (this.players.length == 1) {
			this._leader = this.players[0];
			return true;
		}

		this._gameLoop.onPlayerElimination(player);
	}

	public setLeader(player: ActivePlayer) {
		if (player.trackedData.cities.cities.length > this.leader.trackedData.cities.cities.length) {
			this._leader = player;
		}
	}
}

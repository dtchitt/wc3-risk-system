import { SettingsContext } from '../settings/settings-context';
import { MatchGameLoop } from './match-game-loop';
import { GameState } from './state/game-state';
import { MatchData } from './state/match-state';

export class GameManager {
	private _state: GameState;
	private _gameLoop: MatchGameLoop;

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
		this._gameLoop.startCountdown();
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
		return SettingsContext.getInstance().isPromode();
	}

	public fastRestart() {
		this._gameLoop.startCountdown().then();
	}

	public get getGameState(): GameState {
		return this._state;
	}
}

import { GameLoop } from './game-loop';
import { GameState } from './state/game-state';
import { MatchData } from './state/match-state';

export class GameManager {
	private _state: GameState;
	private _gameLoop: GameLoop;

	private static instance: GameManager;

	private constructor() {
		MatchData.matchState = 'modeSelection';
		this._gameLoop = GameLoop.getInstance();
	}

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new GameManager();
		}

		return this.instance;
	}

	public startGameMode() {
		MatchData.matchState = 'preMatch';
		this._gameLoop.startCountdown();
	}

	public updateState(state: GameState) {
		this._state = state;
		this._state.setObserver(this);
		this._state.run();
	}

	public fastRestart() {
		this._gameLoop.startCountdown().then();
	}

	public get getGameState(): GameState {
		return this._state;
	}
}

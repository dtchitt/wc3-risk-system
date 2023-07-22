import { GameState } from './state/game-state';
import { MetaGame } from './state/meta-game';
import { ModeSelection } from './state/mode-selection';
import { PostGame } from './state/post-game';
import { PreGame } from './state/pre-game';
import { VictoryService } from './victory-service';

export class GameManager {
	private _state: GameState;
	private _round: number;
	private _victoryService: VictoryService;

	private static instance: GameManager;

	private constructor() {
		this._round = 1;
		this._victoryService = new VictoryService();
		this._state = new ModeSelection(new PreGame(new MetaGame(new PostGame())));
	}

	public static getInstance() {
		if (!GameManager.instance) {
			GameManager.instance = new GameManager();
		}

		return GameManager.instance;
	}

	public updateState(state: GameState) {
		this._state = state;
		this._state.setObserver(this);
		this._state.start();
	}

	public get state(): GameState {
		return this._state;
	}

	public get round(): number {
		return this._round;
	}

	public get victoryService(): VictoryService {
		return this._victoryService;
	}
}

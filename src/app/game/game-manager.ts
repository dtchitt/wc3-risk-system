import { GameState } from './state/game-state';
import { MetaGame } from './state/meta-game';
import { ModeSelection } from './state/mode-selection';
import { PostGame } from './state/post-game';
import { PreGame } from './state/pre-game';

export class GameManager {
	private _state: GameState;
	private _round: number;

	private static instance: GameManager;

	private constructor() {
		this._round = 1;
		this.updateState(new ModeSelection(new PreGame(new MetaGame(new PostGame()))));
	}

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new GameManager();
		}

		return this.instance;
	}

	public updateState(state: GameState) {
		this._state = state;
		this._state.setObserver(this);
		this._state.start();
	}

	public isStateMetaGame() {
		return this._state instanceof MetaGame;
	}

	public get round(): number {
		return this._round;
	}
}

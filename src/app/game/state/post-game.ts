import { GameManager } from '../game-manager';
import { GameState } from './game-state';

export class PostGame implements GameState {
	private manager: GameManager;
	private nextState: GameState;

	public constructor() {}

	public setObserver(observer: GameManager) {
		this.manager = observer;
	}

	public start(): void {
		print('post game');

		//hideUI(true);
		//const statsBoard = StatisticsBoard.create();
		//After board is showing, clean the game
		//Delete all Units
		//Replace guards
		//Change city owners
		//Scoreboard stuff?
		//Reset timer?
	}

	public end(): void {
		//Clean Game
		//
	}
}

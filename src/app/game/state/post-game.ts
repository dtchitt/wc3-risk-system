import { StatisticsBoard } from 'src/app/ui/statistics/statistics-board';
import { GameManager } from '../game-manager';
import { GameState } from './game-state';
import { hideUI } from 'src/app/ui/console';

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
		//const statsBoard: StatisticsBoard = new StatisticsBoard();
	}

	public end(): void {}
}

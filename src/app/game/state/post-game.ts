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
		throw new Error('Method not implemented.');
	}

	public end(): void {}
}

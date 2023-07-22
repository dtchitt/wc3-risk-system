import { GameManager } from '../game-manager';
import { GameState } from './game-state';

export class PostGame implements GameState {
	private observer: GameManager;
	private nextState: GameState;

	public constructor() {}

	public setObserver(observer: GameManager) {
		this.observer = observer;
	}

	public start(): void {
		throw new Error('Method not implemented.');
	}

	public end(): void {}
}

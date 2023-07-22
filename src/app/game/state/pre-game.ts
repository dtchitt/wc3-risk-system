import { GameManager } from '../game-manager';
import { GameState } from './game-state';

export class PreGame implements GameState {
	private observer: GameManager;
	private nextState: GameState;

	public constructor(nextState: GameState) {
		this.nextState = nextState;
	}

	public setObserver(observer: GameManager) {
		this.observer = observer;
	}

	public start(): void {
		throw new Error('Method not implemented.');
	}

	public end(): void {}
}

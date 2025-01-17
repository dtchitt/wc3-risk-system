import { GameManager } from '../game-manager';
import { GameState } from './game-state';
import { TreeManager } from '../services/tree-service';

export class PreGame implements GameState {
	public constructor(nextState: GameState) {
		TreeManager.getInstance();
	}

	public setObserver(observer: GameManager) {}

	public run(): void {}

	public end(): void {}
}

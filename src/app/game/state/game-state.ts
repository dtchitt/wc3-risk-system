import { GameManager } from '../game-manager';

export interface GameState {
	run(): void;
	end(): void;
	setObserver(observer: GameManager): void;
}

import { GameManager } from '../game-manager';

export interface GameState {
	start(): void;
	end(): void;
	setObserver(observer: GameManager): void;
}

import { GameModeEvents } from './game-mode-event';

export interface GameMode extends GameModeEvents {
	isMatchOver: () => boolean;
	onStartMatch: () => void;
	onEndMatch: () => void;
	onStartTurn: (turn: number) => void;
	onEndTurn: (turn: number) => void;
	onTick: (tick: number) => void;
}

import { ActivePlayer } from 'src/app/player/types/active-player';
import { City } from 'src/app/city/city';
import { GameManager } from '../game-manager';
import { VictoryManager } from 'src/app/managers/victory-manager';
import { PlayerManager } from 'src/app/player/player-manager';

export interface GameMode {
	isMatchOver: () => boolean;
	onStartMatch: () => void;
	onEndMatch: () => void;
	onStartTurn: (turn: number) => void;
	onEndTurn: (turn: number) => void;
	onTick: (tick: number) => void;

	onCityCapture: (city: City, preOwner: ActivePlayer, owner: ActivePlayer) => void;
	onForfeits: () => void;
	onRematch: () => void;
	onPlayerElimination: (player: ActivePlayer) => void;
}

export abstract class BaseGameMode implements GameMode {
	private isMatchOverField: boolean = false;

	isMatchOver(): boolean {
		print('isMatchOver');
		return this.isMatchOverField;
	}

	onStartMatch(): void {
		print('onStartMatch');
		this.isMatchOverField = false;
	}

	onEndMatch(): void {
		print('onEndMatch');
		this.isMatchOverField = true;
	}

	onStartTurn(turn: number): void {
		print('onStartTurn');
	}

	onEndTurn(turn: number): void {
		print('onEndTurn');
	}

	onTick(tick: number): void {
		print('onTick');
	}

	onCityCapture(city: City, preOwner: ActivePlayer, owner: ActivePlayer): void {
		print('onCityCapture');
	}

	onForfeits(): void {
		print('onForfeits');
	}

	onRematch(): void {
		print('onRematch');
	}

	onPlayerElimination(): void {
		print('onPlayerElimination');
		if (PlayerManager.getInstance().players.size == 1) {
			this.isMatchOverField = true;
		}
	}
}

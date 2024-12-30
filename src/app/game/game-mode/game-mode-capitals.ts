import { BaseGameMode } from './game-mode';

export class GameModeCapitals implements BaseGameMode {
	OnMatchStart(): void {
		throw new Error('Method not implemented.');
	}

	OnMatchEnd(): void {
		throw new Error('Method not implemented.');
	}

	OnTurnStart(): void {
		throw new Error('Method not implemented.');
	}

	OnTurnEnd(): void {
		throw new Error('Method not implemented.');
	}

	OnTick(): void {
		throw new Error('Method not implemented.');
	}

	OnCityCapture(): void {
		throw new Error('Method not implemented.');
	}

	OnUnitKill(): void {
		throw new Error('Method not implemented.');
	}

	OnUnitDies(): void {
		throw new Error('Method not implemented.');
	}

	OnForfeits(): void {
		throw new Error('Method not implemented.');
	}

	OnRematch(): void {
		throw new Error('Method not implemented.');
	}
}

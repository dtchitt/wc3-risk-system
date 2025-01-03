import { BaseGameMode } from './game-mode';
import { ActivePlayer } from 'src/app/player/types/active-player';
import { City } from 'src/app/city/city';

export class GameModeStandard extends BaseGameMode {
	isMatchOver(): boolean {
		return false;
	}

	onStartTurn(turn: number): void {}

	onStartMatch(): void {}

	onEndMatch(): void {}

	onEndTurn(turn: number): void {}

	onCityCapture(city: City, preOwner: ActivePlayer, owner: ActivePlayer): void {}
}

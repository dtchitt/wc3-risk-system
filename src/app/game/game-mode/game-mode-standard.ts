import { ActivePlayer } from 'src/app/player/types/active-player';
import { City } from 'src/app/city/city';
import { BaseGameMode } from './game-mode';

export class GameModeStandard extends BaseGameMode {
	onEndTurn(turn: number): void {
		super.onEndTurn(turn);
	}

	async onCityCapture(city: City, preOwner: ActivePlayer, owner: ActivePlayer): Promise<void> {
		await super.onCityCapture(city, preOwner, owner);
	}
}

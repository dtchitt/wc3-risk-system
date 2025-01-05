import { ActivePlayer } from 'src/app/player/types/active-player';
import { City } from 'src/app/city/city';
import { BaseGameMode } from './game-mode';

export class GameModeStandard extends BaseGameMode {
	onEndTurn(turn: number): void {
		this.isMatchOverField = true;
		super.onEndTurn(turn);
	}

	onCityCapture(city: City, preOwner: ActivePlayer, owner: ActivePlayer): void {
		super.onCityCapture(city, preOwner, owner);
	}
}

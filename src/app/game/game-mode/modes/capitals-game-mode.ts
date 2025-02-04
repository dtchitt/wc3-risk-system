import { ActivePlayer } from 'src/app/player/types/active-player';
import { City } from 'src/app/city/city';
import { BaseGameMode } from '../base/base-game-mode';
import { NEUTRAL_HOSTILE } from 'src/app/utils/utils';
import { debugPrint } from 'src/app/utils/debug-print';
import { GlobalMessage, LocalMessage } from 'src/app/utils/messages';

export class CapitalsGameMode extends BaseGameMode {
	onEndTurn(turn: number): void {
		super.onEndTurn(turn);
	}

	async onCityCapture(city: City, preOwner: ActivePlayer, owner: ActivePlayer): Promise<void> {
		await super.onCityCapture(city, preOwner, owner);
	}

	async onCitySelected(city: City, player: player): Promise<void> {
		debugPrint(`City selected`);
		if (city.getOwner() === player) return;

		if (city.getOwner() != NEUTRAL_HOSTILE) {
			LocalMessage(
				city.getOwner(),
				`${city.getOwner()} has already selected this city!\nPlease choose another city for your capital.`,
				'Sound\\Interface\\Error.flac'
			);
			return;
		}

		city.changeOwner(player);
		SetUnitOwner(city.guard.unit, player, true);
		city.guard.unit;
		await super.onCitySelected(city, player);
	}

	async onCityDeselected(city: City, player: player): Promise<void> {
		debugPrint(`City deselected`);

		if (city.getOwner() !== player) return;

		city.changeOwner(NEUTRAL_HOSTILE);
		SetUnitOwner(city.guard.unit, NEUTRAL_HOSTILE, true);
		city.guard.unit;
		await super.onCityDeselected(city, player);
	}
}

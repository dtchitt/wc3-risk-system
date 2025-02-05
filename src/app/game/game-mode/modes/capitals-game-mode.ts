import { ActivePlayer } from 'src/app/player/types/active-player';
import { City } from 'src/app/city/city';
import { BaseGameMode } from '../base/base-game-mode';
import { NEUTRAL_HOSTILE, PlayGlobalSound } from 'src/app/utils/utils';
import { debugPrint } from 'src/app/utils/debug-print';
import { CountdownMessage, LocalMessage } from 'src/app/utils/messages';
import { LandCity } from 'src/app/city/land-city';
import { PLAYER_STATUS } from 'src/app/player/status/status-enum';

export class CapitalsGameMode extends BaseGameMode {
	private capitalPickPhase: boolean = false;

	onEndTurn(turn: number): void {
		super.onEndTurn(turn);
	}

	async onCityCapture(city: City, preOwner: ActivePlayer, owner: ActivePlayer): Promise<void> {
		if (preOwner == owner) return;

		if (city.isCapital()) {
			preOwner.status.set(PLAYER_STATUS.DEAD);
		}

		await super.onCityCapture(city, preOwner, owner);
	}

	async onCitySelected(city: City, player: player): Promise<void> {
		debugPrint(`City selected`);

		if (!this.capitalPickPhase) return;
		if (city.getOwner() === player) return;

		if (city.isPort()) {
			LocalMessage(player, `Capital can not be a port!\nPlease choose another city for your capital.`, 'Sound\\Interface\\Error.flac');
			return;
		}

		if (city.getOwner() != NEUTRAL_HOSTILE) {
			LocalMessage(
				player,
				`${city.getOwner()} has already selected this city!\nPlease choose another city for your capital.`,
				'Sound\\Interface\\Error.flac'
			);
			return;
		}

		(city as LandCity).setCapital();

		city.changeOwner(player);
		SetUnitOwner(city.guard.unit, player, true);
		city.guard.unit;
		await super.onCitySelected(city, player);
	}

	async onCityDeselected(city: City, player: player): Promise<void> {
		debugPrint(`City deselected`);

		if (!this.capitalPickPhase) return;
		if (city.getOwner() !== player) return;

		if (city.isPort()) {
			LocalMessage(player, `Capital can not be a port!\nPlease choose another city for your capital.`, 'Sound\\Interface\\Error.flac');
			return;
		}

		city.reset();
		await super.onCityDeselected(city, player);
	}

	async onStartMatch(): Promise<void> {
		FogEnable(false);
		BlzEnableSelections(true, false);

		this.capitalPickPhase = true;

		try {
			PlayGlobalSound('Sound\\Interface\\ArrangedTeamInvitation.flac');
			const startDelayTimer: timer = CreateTimer();
			let duration: number = 30;
			TimerStart(startDelayTimer, 1, true, () => {
				CountdownMessage(`Choose Your Capital\n\nThe Game will start in:\n${duration}`);
				if (duration == 3) {
					BlzFrameSetVisible(BlzGetFrameByName('CountdownFrame', 0), true);
				}
				if (duration <= 0) {
					PauseTimer(startDelayTimer);
					DestroyTimer(startDelayTimer);
					BlzFrameSetVisible(BlzGetFrameByName('CountdownFrame', 0), false);
					EnableSelect(true, true);
					EnableDragSelect(true, true);
					PlayGlobalSound('Sound\\Interface\\Hint.flac');
					this.capitalPickPhase = true;
					super.onStartMatch();
				}
				duration--;
			});
		} catch (error) {
			print('Error in Metagame ' + error);
		}
	}
}

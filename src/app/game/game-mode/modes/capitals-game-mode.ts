import { ActivePlayer } from 'src/app/player/types/active-player';
import { City } from 'src/app/city/city';
import { BaseGameMode } from '../base/base-game-mode';
import { NEUTRAL_HOSTILE, PlayGlobalSound } from 'src/app/utils/utils';
import { debugPrint } from 'src/app/utils/debug-print';
import { CountdownMessage, LocalMessage } from 'src/app/utils/messages';
import { LandCity } from 'src/app/city/land-city';
import { PLAYER_STATUS } from 'src/app/player/status/status-enum';
import { PlayerManager } from 'src/app/player/player-manager';
import { CapitalDistributionService } from '../../services/distribution-service/capital-distribution-service';
import { RegionToCity } from 'src/app/city/city-map';
import { CityToCountry } from 'src/app/country/country-map';
import { NameManager } from 'src/app/managers/names/name-manager';

export class CapitalsGameMode extends BaseGameMode {
	private capitalPickPhase: boolean = false;
	private playerCapitalCities: Map<player, City> = new Map();

	onEndTurn(turn: number): void {
		super.onEndTurn(turn);
	}

	async onCityCapture(city: City, preOwner: ActivePlayer, owner: ActivePlayer): Promise<void> {
		if (preOwner == owner) return;

		if (this.playerCapitalCities.get(preOwner.getPlayer()) === city) {
			LocalMessage(
				preOwner.getPlayer(),
				`Your capital has been captured by ${NameManager.getInstance().getDisplayName(owner.getPlayer())}!\nYou have been eliminated!`,
				'Sound\\Interface\\Error.flac'
			);
			LocalMessage(
				owner.getPlayer(),
				`You have captured the capital of ${NameManager.getInstance().getDisplayName(preOwner.getPlayer())}!\nThey have been eliminated!`,
				'Sound\\Interface\\Victory.flac'
			);
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
				`${NameManager.getInstance().getDisplayName(city.getOwner())} has already selected this city!\nPlease choose another city for your capital.`,
				'Sound\\Interface\\Error.flac'
			);
			return;
		}

		const country = CityToCountry.get(city);
		const cities = country.getCities();
		if (cities.length <= 1) {
			LocalMessage(
				player,
				`Only countries with 2 or cities can be chosen.\nPlease choose another city for your capital.`,
				'Sound\\Interface\\Error.flac'
			);
			return;
		}

		if (cities.find((x) => x.getOwner() != NEUTRAL_HOSTILE) !== undefined) {
			LocalMessage(
				player,
				`${NameManager.getInstance().getDisplayName(city.getOwner())} has already selected this city!\nPlease choose another city for your capital.`,
				'Sound\\Interface\\Error.flac'
			);
			return;
		}

		(city as LandCity).setCapital();

		city.changeOwner(player);
		SetUnitOwner(city.guard.unit, player, true);
		city.guard.unit;

		this.playerCapitalCities.set(player, city);

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

		this.playerCapitalCities.set(player, null);

		await super.onCityDeselected(city, player);
	}

	async onStartMatch(): Promise<void> {
		FogEnable(false);
		BlzEnableSelections(true, false);

		debugPrint('Starting Capitals Game Mode');
		// Initialize the player capital cities map with empty capitals
		this.playerCapitalCities = new Map();
		const players: ActivePlayer[] = [...PlayerManager.getInstance().players.values()];
		players.forEach((player) => {
			this.playerCapitalCities.set(player.getPlayer(), null);
		});

		this.capitalPickPhase = true;

		try {
			PlayGlobalSound('Sound\\Interface\\ArrangedTeamInvitation.flac');
			const startDelayTimer: timer = CreateTimer();
			let duration: number = 5;
			TimerStart(startDelayTimer, 1, true, () => {
				CountdownMessage(`Choose Your Capital\n\nSelection ends in:\n${duration}`);
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
					this.capitalPickPhase = false;
					super.onStartMatch();
				}
				duration--;
			});
		} catch (error) {
			print('Error in Metagame ' + error);
		}
	}

	// // Ensure that all players without capitals get assigned a random capital city.
	override onDistributeBases(): void {
		debugPrint('Distributing capitals');
		new CapitalDistributionService(this.playerCapitalCities).runDistro(() => {
			RegionToCity.forEach((city) => {
				city.guard.reposition();
				//Prevent guards from moving and update unit counts
				IssueImmediateOrder(city.guard.unit, 'stop');

				if (GetOwningPlayer(city.guard.unit) != NEUTRAL_HOSTILE) {
					PlayerManager.getInstance().players.get(GetOwningPlayer(city.guard.unit)).trackedData.units.add(city.guard.unit);
				}

				SetUnitInvulnerable(city.guard.unit, false);
			});
		});
	}
}

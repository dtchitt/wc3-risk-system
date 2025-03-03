import { MatchData } from '../../state/match-state';
import { NameManager } from 'src/app/managers/names/name-manager';
import { ActivePlayer } from 'src/app/player/types/active-player';
import { debugPrint } from 'src/app/utils/debug-print';
import { BaseState } from '../state/base-state';
import { CAPITALS_SELECTION_PHASE } from 'src/configs/game-settings';
import { CountdownMessage, LocalMessage } from 'src/app/utils/messages';
import { NEUTRAL_HOSTILE, PlayGlobalSound } from 'src/app/utils/utils';
import { City } from 'src/app/city/city';
import { LandCity } from 'src/app/city/land-city';
import { CityToCountry } from 'src/app/country/country-map';
import { CapitalsData } from '../mode/capitals-mode';

export class CapitalsSelectionState extends BaseState<CapitalsData> {
	private playerCapitalSelections: Map<player, City>;

	onEnterState() {
		this.runAsync();
	}

	async runAsync(): Promise<void> {
		FogEnable(false);
		BlzEnableSelections(true, false);

		// Initialize the player capital cities map with empty capitals
		this.playerCapitalSelections = new Map();

		MatchData.matchPlayers.forEach((player) => {
			this.playerCapitalSelections.set(player.getPlayer(), undefined);
		});

		debugPrint('1. Starting Capitals Game Mode');

		try {
			debugPrint('2. Capital Pick Phase');
			PlayGlobalSound('Sound\\Interface\\ArrangedTeamInvitation.flac');
			const startDelayTimer: timer = CreateTimer();
			let duration: number = CAPITALS_SELECTION_PHASE;

			debugPrint('3. Capital Pick Phase Timer');
			// Prepare the countdown message
			CountdownMessage(`Choose Your Capital\n\nSelection ends in:\n${duration}`);
			BlzFrameSetVisible(BlzGetFrameByName('CountdownFrame', 0), true);

			debugPrint('4. Capital Pick Phase Timer Start');
			TimerStart(startDelayTimer, 1, true, () => {
				// Clears capital selection and resets selected city if player is eliminated
				this.resetCapitalsForEliminatedPlayers();

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

					this.playerCapitalSelections.forEach((city, _) => {
						city?.reset();
					});

					super.nextState(this.stateData);
				}
				duration--;
			});
		} catch (error) {
			print('Error in Metagame ' + error);
		}
	}

	resetCapitalsForEliminatedPlayers(): void {
		debugPrint('Checking for eliminated players during capital selection phase');
		debugPrint('Match Players: ' + MatchData.matchPlayers.length);
		MatchData.matchPlayers.forEach((player) => {
			debugPrint('Checking player: ' + NameManager.getInstance().getDisplayName(player.getPlayer()));
			if (player.status.isEliminated()) {
				debugPrint('Player left during capital selection phase');
				const city = this.playerCapitalSelections.get(player.getPlayer());
				city?.reset();

				debugPrint("Player's capital selection reset");
				this.playerCapitalSelections.delete(player.getPlayer());
				debugPrint("Player's capital selection removed");
			}
		});
	}

	// Remove player from the capital selection phase if they leave the game
	onPlayerLeft(player: ActivePlayer): void {
		debugPrint('Capitals Player left the game: ' + NameManager.getInstance().getDisplayName(player.getPlayer()));
		debugPrint('Player left during capital selection phase');
		const city = this.playerCapitalSelections.get(player.getPlayer());
		city?.reset();

		debugPrint("Player's capital selection reset");
		this.playerCapitalSelections.delete(player.getPlayer());
		debugPrint("Player's capital selection removed");

		super.onPlayerLeft(player);
	}

	onCitySelected(city: City, player: player): void {
		if (city.getOwner() === player) return;

		if (city.isPort()) {
			LocalMessage(player, `Capital can not be a port!\nPlease choose another city as your capital.`, 'Sound\\Interface\\Error.flac');
			return;
		}

		if (city.getOwner() != NEUTRAL_HOSTILE) {
			LocalMessage(
				player,
				`${NameManager.getInstance().getDisplayName(city.getOwner())} has already selected this city!\nPlease choose another city as your capital.`,
				'Sound\\Interface\\Error.flac'
			);
			return;
		}

		const country = CityToCountry.get(city);
		const cities = country.getCities();
		if (cities.length <= 1) {
			LocalMessage(
				player,
				`Only countries with 2 or cities can be chosen.\nPlease choose another city as your capital.`,
				'Sound\\Interface\\Error.flac'
			);
			return;
		}

		if (cities.find((x) => x.getOwner() != NEUTRAL_HOSTILE && x.getOwner() != player) !== undefined) {
			LocalMessage(
				player,
				`${NameManager.getInstance().getDisplayName(city.getOwner())} has already selected this city!\nPlease choose another city as your capital.`,
				'Sound\\Interface\\Error.flac'
			);
			return;
		}

		this.playerCapitalSelections.get(player)?.reset();

		(city as LandCity).setCapital();

		city.changeOwner(player);
		SetUnitOwner(city.guard.unit, player, true);

		this.playerCapitalSelections.set(player, city);

		super.onCitySelected(city, player);
	}
}

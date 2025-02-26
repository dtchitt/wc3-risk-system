import { ActivePlayer } from 'src/app/player/types/active-player';
import { City } from 'src/app/city/city';
import { BaseGameMode } from '../base/base-game-mode';
import { NEUTRAL_HOSTILE, PlayGlobalSound } from 'src/app/utils/utils';
import { debugPrint } from 'src/app/utils/debug-print';
import { CountdownMessage, LocalMessage } from 'src/app/utils/messages';
import { LandCity } from 'src/app/city/land-city';
import { PLAYER_STATUS } from 'src/app/player/status/status-enum';
import { CapitalDistributionService } from '../../services/distribution-service/capital-distribution-service';
import { RegionToCity } from 'src/app/city/city-map';
import { CityToCountry } from 'src/app/country/country-map';
import { NameManager } from 'src/app/managers/names/name-manager';
import { UNIT_ID } from 'src/configs/unit-id';
import { CAPITALS_SELECTION_PHASE } from 'src/configs/game-settings';
import { MatchData } from '../../state/match-state';

export class CapitalsGameMode extends BaseGameMode {
	private capitalPickPhase: boolean = false;
	private playerCapitalSelections: Map<player, City>;
	private capitals: Map<player, City>;

	onEndTurn(turn: number): void {
		super.onEndTurn(turn);
	}

	onCityCapture(city: City, preOwner: ActivePlayer, owner: ActivePlayer): void {
		if (preOwner == owner) return;

		if (this.capitals.get(preOwner.getPlayer()) === city) {
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

			if (GetUnitTypeId(city.barrack.unit) == UNIT_ID.CAPITAL) {
				IssueImmediateOrderById(city.barrack.unit, UNIT_ID.CONQUERED_CAPITAL);
			}

			// Reset the country spawn multiplier to 1
			CityToCountry.get(city).getSpawn().setMultiplier(1);
		}

		super.onCityCapture(city, preOwner, owner);
	}

	onCitySelected(city: City, player: player): void {
		if (!this.capitalPickPhase) return;
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

	async onRematch(): Promise<void> {
		this.capitals?.forEach((city, _) => {
			if (city) {
				const unitTypeId = GetUnitTypeId(city.barrack.unit);
				if (unitTypeId == UNIT_ID.CAPITAL || unitTypeId == UNIT_ID.CONQUERED_CAPITAL) {
					IssueImmediateOrderById(city.barrack.unit, UNIT_ID.CITY);
				}
			}
		});

		await super.onRematch();
	}

	async onStartMatch(): Promise<void> {
		FogEnable(false);
		BlzEnableSelections(true, false);

		// Initialize the player capital cities map with empty capitals
		this.playerCapitalSelections = new Map();

		MatchData.matchPlayers.forEach((player) => {
			this.playerCapitalSelections.set(player.getPlayer(), undefined);
		});

		debugPrint('1. Starting Capitals Game Mode');

		this.capitalPickPhase = true;
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
					this.capitalPickPhase = false;

					this.playerCapitalSelections.forEach((city, _) => {
						city?.reset();
					});
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
		debugPrint('5. Distributing Capitals');
		const capitalDistroService = new CapitalDistributionService(this.playerCapitalSelections);
		capitalDistroService.runDistro(() => {
			RegionToCity.forEach((city) => {
				city.guard.reposition();
				//Prevent guards from moving and update unit counts
				IssueImmediateOrder(city.guard.unit, 'stop');

				if (GetOwningPlayer(city.guard.unit) != NEUTRAL_HOSTILE) {
					MatchData.matchPlayers.find((x) => x.getPlayer() == GetOwningPlayer(city.guard.unit)).trackedData.units.add(city.guard.unit);
				}

				SetUnitInvulnerable(city.guard.unit, false);
			});
		});

		debugPrint('6. Capitals Distributed');
		// Use the capital distribution service to also get the randomly assigned player capital cities
		this.capitals = new Map(capitalDistroService.selectedPlayerCapitalCities);

		debugPrint('7. Capitals Assigned');
		// Set the country spawn multiplier to 2 for all countries with capitals
		this.capitals.forEach((city, _) => {
			if (city) {
				CityToCountry.get(city).getSpawn().setMultiplier(2);
			}
		});

		debugPrint('8. Country Multipliers Set');
		this.capitals.forEach((city, player) => {
			if (city) {
				PingMinimapLocForPlayer(player, city.barrack.location, 20);
			}
		});

		debugPrint('9. Capitals Pinged');
		this.capitals.forEach((city, player) => {
			if (city) {
				IssueImmediateOrderById(city.barrack.unit, UNIT_ID.CAPITAL);
			}
		});
		debugPrint('10. Capitals Distributed');
	}

	// Remove player from the capital selection phase if they leave the game
	onPlayerLeft(player: ActivePlayer): void {
		debugPrint('Capitals Player left the game: ' + NameManager.getInstance().getDisplayName(player.getPlayer()));
		if (this.capitalPickPhase) {
			debugPrint('Player left during capital selection phase');
			const city = this.playerCapitalSelections.get(player.getPlayer());
			city?.reset();

			debugPrint("Player's capital selection reset");
			this.playerCapitalSelections.delete(player.getPlayer());
			debugPrint("Player's capital selection removed");
		}

		super.onPlayerLeft(player);
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
}

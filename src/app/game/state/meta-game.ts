import { VictoryManager } from 'src/app/managers/victory-manager';
import { PlayerManager } from 'src/app/player/player-manager';
import { PLAYER_STATUS } from 'src/app/player/status/status-enum';
import { GameManager } from '../game-manager';
import { GameState } from './game-state';
import { SettingsContext } from 'src/app/settings/settings-context';
import { TimerService } from '../services/timer-service';
import { NameManager } from 'src/app/managers/names/name-manager';
import { CountdownMessage } from 'src/app/utils/messages';
import { NEUTRAL_HOSTILE, PlayGlobalSound } from 'src/app/utils/utils';
import { ActivePlayer } from 'src/app/player/types/active-player';
import { ScoreboardManager } from 'src/app/scoreboard/scoreboard-manager';
import { CityToCountry } from 'src/app/country/country-map';
import { Wait } from 'src/app/utils/wait';

export class MetaGame implements GameState {
	private manager: GameManager;
	private nextState: GameState;
	private timer: TimerService;

	public constructor(nextState: GameState) {
		this.nextState = nextState;
		this.timer = new TimerService(this);
	}

	public setObserver(observer: GameManager) {
		this.manager = observer;
	}

	public async start() {
		try {
			const players: ActivePlayer[] = [...PlayerManager.getInstance().players.values()];

			players.forEach((player) => {
				SetPlayerState(player.getPlayer(), PLAYER_STATE_RESOURCE_GOLD, 0);
				player.status.set(PLAYER_STATUS.ALIVE);
				player.trackedData.bonus.showForPlayer(player.getPlayer());
				player.trackedData.bonus.repositon();
				VictoryManager.getInstance().addPlayer(player);
			});

			const scoreboardManager: ScoreboardManager = ScoreboardManager.getInstance();
			const settingsContext: SettingsContext = SettingsContext.getInstance();

			if (settingsContext.isFFA() || players.length <= 2) {
				scoreboardManager.ffaSetup(players);
			} else {
				scoreboardManager.teamSetup();
			}

			scoreboardManager.obsSetup(players, [...PlayerManager.getInstance().observers.keys()]);

			settingsContext.applyStrategy('Fog');

			if (settingsContext.isPromode()) {
				await this.setTempVision(PlayerManager.getInstance().players);
			}

			PlayGlobalSound('Sound\\Interface\\ArrangedTeamInvitation.flac');

			const startDelayTimer: timer = CreateTimer();
			let duration: number = 3;

			TimerStart(startDelayTimer, 1, true, () => {
				CountdownMessage(`The Game will start in:\n${duration}`);

				if (duration == 3) {
					BlzFrameSetVisible(BlzGetFrameByName('CountdownFrame', 0), true);
				}

				if (duration <= 0) {
					PauseTimer(startDelayTimer);
					DestroyTimer(startDelayTimer);
					BlzFrameSetVisible(BlzGetFrameByName('CountdownFrame', 0), false);
					EnableSelect(true, true);
					EnableDragSelect(true, true);
					this.timer.start();
					PlayGlobalSound('Sound\\Interface\\Hint.flac');
				}

				duration--;
			});
		} catch (error) {
			print('Error in Metagame ' + error);
		}
	}

	public end(): void {
		ScoreboardManager.getInstance().destroyBoards();

		PlayerManager.getInstance().players.forEach((player) => {
			if (SettingsContext.getInstance().isPromode()) {
				NameManager.getInstance().setName(player.getPlayer(), 'acct');
			} else {
				NameManager.getInstance().setName(player.getPlayer(), 'btag');
				player.trackedData.bonus.hideUI();
			}
		});

		this.timer.reset();

		this.manager.updateState(this.nextState);
	}

	private async setTempVision(players: Map<player, ActivePlayer>) {
		let defaultSightRange = 1400;
		const visionMap: Map<unit, player[]> = new Map<unit, player[]>();

		DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `Revealing blocks`);

		for (const player of players.values()) {
			const playerHandle: player = player.getPlayer();

			player.trackedData.cities.cities.forEach((city) => {
				CityToCountry.get(city)
					.getCities()
					.forEach((city) => {
						const unit: unit = city.guard.unit;

						defaultSightRange = BlzGetUnitRealField(unit, UNIT_RF_SIGHT_RADIUS);
						BlzSetUnitRealField(unit, UNIT_RF_SIGHT_RADIUS, 300);

						if (GetOwningPlayer(unit) != NEUTRAL_HOSTILE) {
							UnitShareVision(unit, playerHandle, true);

							if (!visionMap.has(unit)) {
								visionMap.set(unit, []);
							}

							visionMap.get(unit).push(playerHandle);
						}
					});
			});
		}

		await Wait.forSeconds(4);

		for (const unit of visionMap.keys()) {
			visionMap.get(unit).forEach((player) => {
				UnitShareVision(unit, player, false);
				BlzSetUnitRealField(unit, UNIT_RF_SIGHT_RADIUS, defaultSightRange);
			});
		}

		ClearTextMessages();
	}
}

import { GameManager } from '../game-manager';
import { GameState } from './game-state';
import { PLAYER_SLOTS } from 'src/app/utils/utils';
import { UNIT_TYPE } from 'src/app/utils/unit-types';
import { StringToCountry } from 'src/app/country/country-map';
import { PlayerManager } from 'src/app/player/player-manager';
import { VictoryManager } from 'src/app/managers/victory-manager';
import { StatisticsController } from 'src/app/statistics/statistics-controller';
import { CountryToRegion } from 'src/app/region/region-map';
import { SettingsContext } from 'src/app/settings/settings-context';
import { TreeManager } from '../services/tree-service';
import { TeamManager } from 'src/app/teams/team-manager';
import { Wait } from 'src/app/utils/wait';

export class PostGame implements GameState {
	private manager: GameManager;
	private nextState: GameState;
	private isOver: boolean;

	public constructor() {
		this.isOver = false;
	}

	public setObserver(observer: GameManager) {
		this.manager = observer;
	}

	public start(): void {
		if (this.isOver) return;
		this.isOver = true;

		if (SettingsContext.getInstance().isPromode()) {
			VictoryManager.getInstance().updateWinTracker();
		} else {
			const statsController: StatisticsController = StatisticsController.getInstance();
			statsController.refreshView();
			statsController.setViewVisibility(true);
		}

		FogEnable(false);

		this.manager.setRestartEnabled(true);
	}

	public async end() {
		if (!this.isOver) return;

		print('Removing units...');
		await this.removeUnits();
		print('Resetting countries...');
		await this.resetCountries();
		await Wait.forSeconds(1);
		print('Resetting regions...');
		await this.resetRegions();
		print('Resetting trees...');
		await TreeManager.getInstance().reset();
		print('Resetting game data...');

		VictoryManager.getInstance().reset();

		if (!SettingsContext.getInstance().isPromode()) {
			StatisticsController.getInstance().setViewVisibility(false);
		}

		if (!SettingsContext.getInstance().isFFA()) {
			TeamManager.getInstance()
				.getTeams()
				.forEach((team) => {
					team.reset();
				});
		}

		PlayerManager.getInstance().players.forEach((player) => {
			player.reset();
		});

		print('Preparing next round...');
		await Wait.forSeconds(1);
		this.isOver = false;
		this.manager.setRestartEnabled(false);
		FogEnable(true);
		this.manager.fastRestart();
	}

	private removeUnits(): Promise<void> {
		return new Promise((resolve) => {
			const group: group = CreateGroup();

			for (let i = 0; i < PLAYER_SLOTS; i++) {
				const player = Player(i);

				GroupEnumUnitsOfPlayer(
					group,
					player,
					Filter(() => {
						const unit: unit = GetFilterUnit();

						if (!IsUnitType(unit, UNIT_TYPE.BUILDING) && !IsUnitType(unit, UNIT_TYPE.GUARD)) {
							RemoveUnit(unit);
						}
					})
				);

				GroupClear(group);
			}

			DestroyGroup(group);

			resolve();
		});
	}

	private resetCountries(): Promise<void> {
		return new Promise((resolve) => {
			StringToCountry.forEach((country) => {
				country.reset();
			});
			resolve();
		});
	}

	private resetRegions(): Promise<void> {
		return new Promise((resolve) => {
			CountryToRegion.forEach((region) => {
				region.reset();
			});
			resolve();
		});
	}
}

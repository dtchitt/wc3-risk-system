import { GameManager } from '../game-manager';
import { GameState } from './game-state';
import { PLAYER_SLOTS } from 'src/app/utils/utils';
import { UNIT_TYPE } from 'src/app/utils/unit-types';
import { StringToCountry } from 'src/app/country/country-map';
import { VictoryManager } from 'src/app/managers/victory-manager';
import { StatisticsController } from 'src/app/statistics/statistics-controller';
import { CountryToRegion } from 'src/app/region/region-map';
import { SettingsContext } from 'src/app/settings/settings-context';
import { TreeManager } from '../services/tree-service';
import { TeamManager } from 'src/app/teams/team-manager';
import { PlayerManager } from 'src/app/entity/player/player-manager';

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

	public end(): void {
		if (!this.isOver) return;

		this.removeUnits();
		this.resetCountries();
		this.resetRegions();
		TreeManager.getInstance().reset();
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

		PlayerManager.getInstance()
			.getPlayerMap()
			.forEach((player) => {
				player.reset();
			});

		this.isOver = false;
		this.manager.setRestartEnabled(false);
	}

	private removeUnits() {
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
	}

	private resetCountries() {
		StringToCountry.forEach((country) => {
			country.reset();
		});
	}

	private resetRegions() {
		CountryToRegion.forEach((region) => {
			region.reset();
		});
	}
}

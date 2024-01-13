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
	}

	public end(): void {
		if (!this.isOver) return;

		this.removeUnits();
		this.resetCountries();
		this.resetRegions();

		VictoryManager.getInstance().reset();
		if (!SettingsContext.getInstance().isPromode()) {
			StatisticsController.getInstance().setViewVisibility(false);
		}
		PlayerManager.getInstance().players.forEach((player) => {
			player.reset();
		});

		this.isOver = false;
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

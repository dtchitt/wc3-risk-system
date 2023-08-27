import { StatisticsBoard } from 'src/app/ui/statistics/statistics-board';
import { GameManager } from '../game-manager';
import { GameState } from './game-state';
import { PLAYER_SLOTS } from 'src/app/utils/utils';
import { UNIT_TYPE } from 'src/app/utils/unit-types';
import { StringToCountry } from 'src/app/country/country-map';
import { PlayerManager } from 'src/app/player/player-manager';
import { VictoryManager } from 'src/app/managers/victory-manager';

export class PostGame implements GameState {
	private manager: GameManager;
	private nextState: GameState;

	public constructor() {}

	public setObserver(observer: GameManager) {
		this.manager = observer;
	}

	public start(): void {
		StatisticsBoard.create();
		this.removeUnits();
		this.resetOwnables();
	}

	public end(): void {
		VictoryManager.getInstance().reset();
		StatisticsBoard.hide();
		PlayerManager.getInstance().players.forEach((player) => {
			player.reset();
		});
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

	private resetOwnables() {
		StringToCountry.forEach((country) => {
			country.reset();
		});
	}
}

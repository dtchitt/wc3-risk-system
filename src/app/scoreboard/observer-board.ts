import { NameManager } from '../managers/names/name-manager';
import { TrackedData } from '../player/data/tracked-data';
import { ActivePlayer } from '../player/types/active-player';
import { HexColors } from '../utils/hex-colors';
import { Scoreboard } from './scoreboard';

export class ObserverBoard extends Scoreboard {
	private readonly PLAYER_COL: number = 1;
	private readonly INCOME_COL: number = 2;
	private readonly GOLD_COL: number = 3;
	private readonly CITIES_COL: number = 4;
	private readonly KILLS_COL: number = 5;
	private readonly DEATHS_COL: number = 6;
	private readonly STATUS_COL: number = 7;

	public constructor(aPlayers: ActivePlayer[]) {
		super(aPlayers);

		this.size = this.players.length + 3;

		MultiboardSetColumnCount(this.board, 7);

		for (let i = 1; i <= this.size; i++) {
			MultiboardSetRowCount(this.board, MultiboardGetRowCount(this.board) + 1);
			this.setItemWidth(6.2, i, this.PLAYER_COL);
			this.setItemWidth(4.5, i, this.INCOME_COL);
			this.setItemWidth(3.5, i, this.GOLD_COL);
			this.setItemWidth(4.5, i, this.CITIES_COL);
			this.setItemWidth(3.9, i, this.KILLS_COL);
			this.setItemWidth(3.9, i, this.DEATHS_COL);
			this.setItemWidth(3.0, i, this.STATUS_COL);
		}

		this.setItemValue(`${HexColors.TANGERINE}Player|r`, 1, this.PLAYER_COL);
		this.setItemValue(`${HexColors.TANGERINE}Income|r`, 1, this.INCOME_COL);
		this.setItemValue(`${HexColors.TANGERINE}Gold|r`, 1, this.GOLD_COL);
		this.setItemValue(`${HexColors.TANGERINE}Cities|r`, 1, this.CITIES_COL);
		this.setItemValue(`${HexColors.TANGERINE}Kills|r`, 1, this.KILLS_COL);
		this.setItemValue(`${HexColors.TANGERINE}Deaths|r`, 1, this.DEATHS_COL);
		this.setItemValue(`${HexColors.TANGERINE}Status|r`, 1, this.STATUS_COL);
		this.setItemWidth(20.0, this.size, this.PLAYER_COL);
		this.setItemWidth(0.0, this.size, this.INCOME_COL);
		this.setItemWidth(0.0, this.size, this.GOLD_COL);
		this.setItemWidth(0.0, this.size, this.CITIES_COL);
		this.setItemWidth(0.0, this.size, this.KILLS_COL);
		this.setItemWidth(0.0, this.size, this.DEATHS_COL);
		this.setItemWidth(0.0, this.size, this.STATUS_COL);

		this.updateFull();

		MultiboardSetItemsStyle(this.board, true, false);
		MultiboardMinimize(this.board, true);
		MultiboardMinimize(this.board, false);
		this.setVisibility(false);
	}

	public updateFull(): void {
		this.players.sort((pA, pB) => {
			const playerAIncome: number = pA.trackedData.income.income;
			const playerBIncome: number = pB.trackedData.income.income;

			if (playerAIncome < playerBIncome) return 1;
			if (playerAIncome > playerBIncome) return -1;

			return 0;
		});

		let row: number = 2;

		this.players.forEach((player) => {
			const data: TrackedData = player.trackedData;

			let textColor: string = GetLocalPlayer() == player.getPlayer() ? HexColors.TANGERINE : HexColors.WHITE;

			if (player.status.isAlive() || player.status.isNomad()) {
				this.setItemValue(`${textColor}${data.income.income}`, row, this.INCOME_COL);
			} else {
				this.setItemValue(`${textColor}-`, row, 2);
			}

			this.setColumns(player, row, textColor, data);

			row++;
		});
	}

	public updatePartial(): void {
		let row: number = 2;

		this.players.forEach((player) => {
			const data: TrackedData = player.trackedData;

			let textColor: string = GetLocalPlayer() == player.getPlayer() ? HexColors.TANGERINE : HexColors.WHITE;

			this.setColumns(player, row, textColor, data);

			row++;
		});
	}

	private setColumns(player: ActivePlayer, row: number, textColor: string, data: TrackedData) {
		this.setItemValue(`Dark Green`, row, this.PLAYER_COL);
		this.setItemValue(`999(99)`, row, this.INCOME_COL);
		this.setItemValue(`9999`, row, this.GOLD_COL);
		this.setItemValue(`999(99)`, row, this.CITIES_COL);
		this.setItemValue(`99999`, row, this.KILLS_COL);
		this.setItemValue(`99999`, row, this.DEATHS_COL);
		this.setItemValue(`ZZZZZZ`, row, this.STATUS_COL);
		// this.setItemValue(`${NameManager.getInstance().getDisplayName(player.getPlayer())}`, row, this.PLAYER_COL);
		// this.setItemValue(`${textColor}${data.cities.cities.length}`, row, this.CITIES_COL);
		// this.setItemValue(`${textColor}${data.killsDeaths.get(player.getPlayer()).killValue}`, row, this.KILLS_COL);
		// this.setItemValue(`${textColor}${data.killsDeaths.get(player.getPlayer()).deathValue}`, row, this.DEATHS_COL);

		if (player.status.isNomad() || player.status.isSTFU()) {
			this.setItemValue(`${player.status.status} ${player.status.statusDuration}`, row, this.STATUS_COL);
		} else {
			this.setItemValue(`${player.status.status}`, row, this.STATUS_COL);
		}
	}
}

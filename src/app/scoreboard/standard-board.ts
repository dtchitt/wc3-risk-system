import { NameManager } from '../managers/names/name-manager';
import { TrackedData } from '../player/data/tracked-data';
import { ActivePlayer } from '../player/types/active-player';
import { HexColors } from '../utils/hex-colors';
import { Scoreboard } from './scoreboard';

export class StandardBoard extends Scoreboard {
	private readonly PLAYER_COL: number = 1;
	private readonly INCOME_COL: number = 2;
	private readonly CITIES_COL: number = 3;
	private readonly KILLS_COL: number = 4;
	private readonly DEATHS_COL: number = 5;
	private readonly STATUS_COL: number = 6;

	public constructor(aPlayers: ActivePlayer[]) {
		super(aPlayers);

		this.size = this.players.length + 3;

		MultiboardSetColumnCount(this.board, 6);

		for (let i = 1; i <= this.size; i++) {
			MultiboardSetRowCount(this.board, MultiboardGetRowCount(this.board) + 1);
			this.setItemWidth(8.0, i, this.PLAYER_COL);
			this.setItemWidth(2.5, i, this.INCOME_COL);
			this.setItemWidth(2.5, i, this.CITIES_COL);
			this.setItemWidth(4.0, i, this.KILLS_COL);
			this.setItemWidth(4.0, i, this.DEATHS_COL);
			this.setItemWidth(4.4, i, this.STATUS_COL);
		}

		this.setItemValue(`${HexColors.TANGERINE}Player|r`, 1, this.PLAYER_COL);
		this.setItemValue(`${HexColors.TANGERINE}Inc|r`, 1, this.INCOME_COL);
		this.setItemValue(`${HexColors.TANGERINE}C|r`, 1, this.CITIES_COL);
		this.setItemValue(`${HexColors.TANGERINE}K|r`, 1, this.KILLS_COL);
		this.setItemValue(`${HexColors.TANGERINE}D|r`, 1, this.DEATHS_COL);
		this.setItemValue(`${HexColors.TANGERINE}Status|r`, 1, this.STATUS_COL);
		this.setItemWidth(20.0, this.size, this.PLAYER_COL);
		this.setItemWidth(0.0, this.size, this.INCOME_COL);
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
		this.setItemValue(`${NameManager.getInstance().getDisplayName(player.getPlayer())}`, row, this.PLAYER_COL);
		this.setItemValue(`${textColor}${data.cities.cities.length}`, row, this.CITIES_COL);
		this.setItemValue(`${textColor}${data.killsDeaths.get(player.getPlayer()).killValue}`, row, this.KILLS_COL);
		this.setItemValue(`${textColor}${data.killsDeaths.get(player.getPlayer()).deathValue}`, row, this.DEATHS_COL);

		if (player.status.isNomad() || player.status.isSTFU()) {
			this.setItemValue(`${player.status.status} ${player.status.statusDuration}`, row, this.STATUS_COL);
		} else {
			this.setItemValue(`${player.status.status}`, row, this.STATUS_COL);
		}
	}
}
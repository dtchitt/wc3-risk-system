import { NameManager } from '../managers/names/name-manager';
import { TrackedData } from '../player/data/tracked-data';
import { ActivePlayer } from '../player/types/active-player';
import { HexColors } from '../utils/hex-colors';
import { PLAYER_COLOR_CODES_MAP } from '../utils/player-colors';
import { Scoreboard } from './scoreboard';

export class MiniBoard extends Scoreboard {
	private readonly PLAYER_COL: number = 1;
	private readonly INCOME_COL: number = 2;

	public constructor(aPlayers: ActivePlayer[]) {
		super(aPlayers);

		this.size = this.players.length + 3;

		MultiboardSetColumnCount(this.board, 2);

		for (let i = 1; i <= this.size; i++) {
			MultiboardSetRowCount(this.board, MultiboardGetRowCount(this.board) + 1);
			this.setItemWidth(8.0, i, this.PLAYER_COL);
			this.setItemWidth(2.5, i, this.INCOME_COL);
		}

		this.setItemValue(`${HexColors.TANGERINE}Player|r`, 1, this.PLAYER_COL);
		this.setItemValue(`${HexColors.TANGERINE}Inc|r`, 1, this.INCOME_COL);
		this.setItemWidth(11.0, this.size, this.PLAYER_COL);
		this.setItemWidth(0.0, this.size, this.INCOME_COL);

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

			this.setItemValue(`${NameManager.getInstance().getDisplayName(player.getPlayer())}`, row, this.PLAYER_COL);

			row++;
		});
	}

	public updatePartial(): void {
		let row: number = 2;

		this.players.forEach((player) => {
			const data: TrackedData = player.trackedData;

			//TODO update player income color based on status
			// let textColor: string = GetLocalPlayer() == player.getPlayer() ? HexColors.TANGERINE : HexColors.WHITE;

			// if (player.status.isAlive() || player.status.isNomad()) {
			// 	this.setItemValue(`${textColor}${data.income.income}`, row, this.INCOME_COL);
			// } else {
			// 	this.setItemValue(`${textColor}-`, row, 2);
			// }

			row++;
		});
	}

	public setAlert(player: player, countryName: string): void {
		this.setItemValue(`${PLAYER_COLOR_CODES_MAP.get(GetPlayerColor(player))}${countryName}|r`, this.size, 1);
	}
}

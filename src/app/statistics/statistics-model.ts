import { GamePlayer } from '../entity/player/game-player';
import { PlayerManager } from '../entity/player/player-manager';
import { NameManager } from '../managers/names/name-manager';
import { VictoryManager } from '../managers/victory-manager';
import { HexColors } from '../utils/hex-colors';
import { AddLeadingZero } from '../utils/utils';
import { ColumnConfig, GetStatisticsColumns } from './statistics-column-config';

export class StatisticsModel {
	private timePlayed: string;
	private ranks: GamePlayer[];
	private winner: GamePlayer;
	private columns: ColumnConfig[];

	constructor() {
		this.setData();
	}

	public setData() {
		this.setGameTime();
		this.winner = VictoryManager.getInstance().leader;
		this.ranks = [...PlayerManager.getInstance().getPlayerMap().values()];
		this.sortPlayersByRank(this.ranks, this.winner);
		this.columns = GetStatisticsColumns(this);
	}

	public getTimePlayed(): string {
		return this.timePlayed;
	}

	public getRanks(): GamePlayer[] {
		return this.ranks;
	}

	public getWinner(): GamePlayer {
		return this.winner;
	}

	public getColumnData(): ColumnConfig[] {
		return this.columns;
	}

	public getRival(player: GamePlayer): string {
		let rival: GamePlayer | null = null;
		let maxKills = 0;

		PlayerManager.getInstance()
			.getPlayerMap()
			.forEach((p) => {
				if (p === player) return;

				const killsOnPlayer = p.getData().getKillsDeaths().get(player.getPlayer()).kills;

				if (killsOnPlayer > maxKills) {
					maxKills = killsOnPlayer;
					rival = p;
				}
			});

		if (rival !== null) {
			return NameManager.getInstance().getDisplayName(rival.getPlayer()).split('#')[0];
		} else {
			return 'None';
		}
	}

	private setGameTime() {
		const turnTime: number = 60;
		const minutes: number = parseInt(BlzFrameGetText(BlzGetFrameByName('ResourceBarSupplyText', 0))) - 1;
		const seconds: number = turnTime - parseInt(BlzFrameGetText(BlzGetFrameByName('ResourceBarUpkeepText', 0)));
		const hours: number = Math.floor(minutes / turnTime);
		const remainingMinutes: number = minutes % turnTime;
		const formattedTime: string = `${AddLeadingZero(hours)}:${AddLeadingZero(remainingMinutes)}:${AddLeadingZero(seconds)}`;
		const totalTurns: number = minutes + seconds / turnTime;

		this.timePlayed = `${HexColors.TANGERINE}Game Time:|r ${formattedTime}\n${HexColors.TANGERINE}Total Turns:|r ${totalTurns.toFixed(2)}`;
	}

	private sortPlayersByRank(players: GamePlayer[], winner: GamePlayer) {
		return players.sort((playerA, playerB) => {
			if (playerA === winner) return -1;
			if (playerB === winner) return 1;

			if (playerA.getData().getTurnDied() !== playerB.getData().getTurnDied()) {
				return playerB.getData().getTurnDied() - playerA.getData().getTurnDied();
			}

			return playerB.getData().getCities().cities.length - playerA.getData().getCities().cities.length;
		});
	}
}

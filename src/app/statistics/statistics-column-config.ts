import { GamePlayer } from '../entity/player/game-player';
import { NameManager } from '../managers/names/name-manager';
import { ComputeRatio } from '../utils/utils';
import { StatisticsModel } from './statistics-model';

type TextFunction = (player: GamePlayer) => string;

export interface ColumnConfig {
	size: number;
	header: string;
	textFunction: TextFunction;
}

export function GetStatisticsColumns(model: StatisticsModel): ColumnConfig[] {
	return [
		{
			size: 0.11,
			header: 'Player Names',
			textFunction: (player) => NameManager.getInstance().getDisplayName(player.getPlayer()),
		},
		{
			size: 0.04,
			header: 'Rank',
			textFunction: (player) => `${model.getRanks().indexOf(player) + 1}`,
		},
		{
			size: 0.09,
			header: 'Biggest Rival',
			textFunction: (player) => model.getRival(player),
		},
		{
			size: 0.06,
			header: 'Last Turn',
			textFunction: (player) => `${player.getData().getTurnDied()}`,
		},
		{
			size: 0.06,
			header: 'Cities\nMax/End',
			textFunction: (player) => `${player.getData().getCities().max}/${player.getData().getCities().end}`,
		},
		{
			size: 0.06,
			header: 'Income\nMax/End',
			textFunction: (player) => `${player.getData().getIncome().max}/${player.getData().getIncome().end}`,
		},
		{
			size: 0.05,
			header: 'Bounty',
			textFunction: (player) => `${player.getData().getBounty().getTotal()}`,
		},
		{
			size: 0.05,
			header: 'Bonus',
			textFunction: (player) => `${player.getData().getBonus().getTotal()}`,
		},
		{
			size: 0.09,
			header: 'Gold Earned/\nMax/End',
			textFunction: (player) => `${player.getData().getGold().earned}/${player.getData().getGold().max}/${player.getData().getGold().end}`,
		},
		{
			size: 0.06,
			header: 'Kills\n(Value)',
			textFunction: (player) => `${player.getData().getKillsDeaths().get(player.getPlayer()).killValue}`,
		},
		{
			size: 0.06,
			header: 'Deaths\n(Value)',
			textFunction: (player) => `${player.getData().getKillsDeaths().get(player.getPlayer()).deathValue}`,
		},
		{
			size: 0.06,
			header: 'KD Ratio\n(Value)',
			textFunction: (player) =>
				ComputeRatio(
					player.getData().getKillsDeaths().get(player.getPlayer()).killValue,
					player.getData().getKillsDeaths().get(player.getPlayer()).deathValue
				),
		},
	];
}

import { Cities } from './data/cities';
import { Income } from './data/income';
import { KillsDeaths } from './data/kills-death';

export interface EntityData {
	getIncome(): Income;
	getCities(): Cities;
	getKillsDeaths(): Map<string | player, KillsDeaths>;
}

import { Country } from '../country/country';
import { Bounty } from './data/bonus/bounty';
import { FightBonus } from './data/bonus/fight-bonus';
import { Gold } from './data/gold';
import { EntityData } from './entity-data';

export interface SingleEntityData extends EntityData {
	getGold(): Gold;
	getBounty(): Bounty;
	getBonus(): FightBonus;
	getCountries(): Map<Country, number>;
	getUnits(): Set<unit>;
	getTurnDied(): number;
	setTurnDied(turn: number): void;
	getTrainedUnits(): Map<number, number>;
}

//players will have singleentitydata
//players can override entity data with singleentitydata with their implementation of game entity
//teams will have entitydata
//we want two scoreboards still, one for ffa and one for tg
//obs board will need 2 variants as well
//victorymanager can use gameentity
//stats board can use single entity
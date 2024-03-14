import { DiplomacySubOptions } from './strategies/diplomacy-strategy';

export interface Settings {
	GameType: number;
	Diplomacy: DiplomacySubOptions;
	Fog: number;
	Promode: number;
}

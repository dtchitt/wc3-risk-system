import { DiplomacyOptions } from './strategies/diplomacy-strategy';

export interface Settings {
	GameType: number;
	Diplomacy: DiplomacyOptions;
	Fog: number;
	Promode: number;
}

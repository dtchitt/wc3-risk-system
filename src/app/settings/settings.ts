import { DiplomacyOptions } from './strategies/diplomacy-strategy';

export interface Settings {
	GameType: number;
	Diplomacy: DiplomacyOptions;
	Fog: number;
	GoldSending: number;
	Ships: number;
	Promode: number;
}

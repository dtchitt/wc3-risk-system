// import { SettingsStrategy } from './strategies/settings-strategy';
// import { DiplomacyStrategy } from './strategies/diplomacy-strategy';
// import { FogStrategy } from './strategies/fog-strategy';
// import { GameTypeStrategy } from './strategies/game-type-strategy';
// import { PromodeStrategy } from './strategies/promode-strategy';
// import { Settings } from './settings';

// export type SettingsKey = 'GameType' | 'Diplomacy' | 'PlayersPerTeam' | 'EqualizeTeams' | 'Fog';

// export class SettingsController {
// 	private static instance: SettingsController;
// 	private handlers: Map<SettingsKey, SettingsStrategy>;
// 	private settings: Settings;

// 	private constructor(settings: Settings) {
// 		this.settings = settings;
// 		this.handlers = new Map<SettingsKey, SettingsStrategy>();
// 		this.handlers.set('GameType', new GameTypeStrategy(this.settings.GameType));
// 		this.handlers.set('Diplomacy', new DiplomacyStrategy(this.settings.Diplomacy));
// 		this.handlers.set('Fog', new FogStrategy(this.settings.Fog));
// 		this.handlers.set('Promode', new PromodeStrategy(this.settings.Promode, this));
// 	}

// 	public static getInstance(): SettingsController {
// 		if (!this.instance) {
// 			this.instance = new SettingsController(<Settings>{
// 				GameType: 0,
// 				Diplomacy: 0,
// 				PlayersPerTeam: 0,
// 				EqualizeTeams: false,
// 				Fog: 0,
// 			});
// 		}

// 		return this.instance;
// 	}

// 	/**
// 	 * Apply a strategy
// 	 * @param key string to identify which strategy to apply
// 	 */
// 	public applySettings() {
// 		this.handlers.get('GameType').apply();
// 	}

// 	public getSettings(): Settings {
// 		return this.settings;
// 	}

// 	public isFFA(): boolean {
// 		return this.settings.Diplomacy === 0;
// 	}
// }

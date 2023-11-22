import { SettingsStrategy } from './strategies/settings-strategy';
import { DiplomacyStrategy } from './strategies/diplomacy-strategy';
import { FogStrategy } from './strategies/fog-strategy';
import { GameTypeStrategy } from './strategies/game-type-strategy';
import { PromodeStrategy } from './strategies/promode-strategy';
import { GoldStrategy } from './strategies/gold-strategy';
import { Settings } from './settings';

export type SettingsKey = 'GameType' | 'Diplomacy' | 'Fog' | 'GoldSending' | 'Promode';

export class SettingsContext {
	private static instance: SettingsContext;

	private strategies: Map<string, SettingsStrategy>;
	private settings: Settings;

	private constructor(settings: Settings) {
		this.settings = settings;
		this.strategies = new Map<string, SettingsStrategy>();
	}

	public static getInstance(): SettingsContext {
		if (this.instance == null) {
			this.instance = new SettingsContext(<Settings>{
				GameType: 0,
				Diplomacy: {
					option: 0,
				},
				Fog: 0,
				GoldSending: 0,
				Ships: 0,
				Promode: 0,
			});
		}

		return this.instance;
	}

	public initStrategies() {
		this.strategies.set('GameType', new GameTypeStrategy(this.settings.GameType));
		this.strategies.set('Diplomacy', new DiplomacyStrategy(this.settings.Diplomacy));

		let playerCount: number = 0;

		for (let i = 0; i < bj_MAX_PLAYERS; i++) {
			if (GetPlayerSlotState(Player(i)) == PLAYER_SLOT_STATE_PLAYING) {
				playerCount++;
			}
		}

		if (playerCount == 2) {
			this.settings.Promode = 1;
			this.settings.Fog = 1;
		}

		this.strategies.set('Promode', new PromodeStrategy(this.settings.Promode));
		this.strategies.set('Fog', new FogStrategy(this.settings.Fog));
		this.strategies.set('Gold', new GoldStrategy(this.settings.GoldSending));
	}

	/**
	 * Apply a strategy
	 * @param key string to identify which strategy to apply
	 */
	public applyStrategy(key: SettingsKey) {
		const strategy = this.strategies.get(key);
		if (strategy) {
			strategy.apply();
		}
	}

	/**
	 * Returns a specific strategy instance
	 * @param key string to identify which strategy to return
	 * @returns the strategy instance
	 */
	public getStrategy(key: SettingsKey): SettingsStrategy | undefined {
		return this.strategies.get(key);
	}

	/**
	 * Gets the current settings object
	 * @returns The current settings.
	 */
	public getSettings(): Settings {
		return this.settings;
	}

	/**
	 * Checks if the game setting promode is on or off
	 * @returns true if game is "promode"
	 */
	public isPromode(): boolean {
		return this.settings.Promode == 1;
	}

	/**
	 * Checks if the game setting for Fog is on or off
	 * @returns true if fog is on
	 */
	public isFogOn(): boolean {
		return this.settings.Fog == 1;
	}
}

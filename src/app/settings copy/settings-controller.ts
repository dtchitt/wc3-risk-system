// import { Settings } from './settings';

// export class SettingsController {
// 	private static instance: SettingsController;
// 	private settings: Settings;

// 	constructor(settings: Settings) {
// 		this.settings = settings;
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

// 	public applySettings(): void {
// 		new GameTypeStrategy().apply(this.settings);
// 	}

// 	public getSettings(): Settings {
// 		return this.settings;
// 	}
// }

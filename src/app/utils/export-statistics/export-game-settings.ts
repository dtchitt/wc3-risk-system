import { File } from 'w3ts';
import { SettingsContext } from 'src/app/settings/settings-context';
import { DiplomacyStrings } from 'src/app/settings/strategies/diplomacy-strategy';
import { FogOptions } from 'src/app/settings/strategies/fog-strategy';
import { GameTypeOptions } from 'src/app/settings/strategies/game-type-strategy';
import { OvertimeStrings } from 'src/app/settings/strategies/overtime-strategy';
import { PromodeOptions } from 'src/app/settings/strategies/promode-strategy';

export class ExportGameSettings {
    private static riskDirectory: string = 'risk';
    private static matchDirectory: string = os.date("%Y-%m-%d-%H-%M-%S", os.time());
    private static mimeType: string = 'txt';

    private static getFileName = (fileName: string) => `${ExportGameSettings.riskDirectory}/${ExportGameSettings.matchDirectory}/${fileName}.${ExportGameSettings.mimeType}`;

    private constructor() {}

    public static async write(settings: SettingsContext): Promise<void> {
        let gameSettings = this.getGameSettings(settings);

        File.writeRaw(this.getFileName("0_GameSettings"), gameSettings, false);
    }

    private static getGameSettings(settings: SettingsContext): string {
        let headers = ['Diplomacy', 'Fog', 'Game Type', 'Overtime', 'Promode'];
        let rows = [
            DiplomacyStrings[settings.getSettings().Diplomacy.option], 
            FogOptions[settings.getSettings().Fog], 
            GameTypeOptions[settings.getSettings().GameType], 
            OvertimeStrings[settings.getSettings().Overtime.option], 
            PromodeOptions[settings.getSettings().Promode]
        ];

        return [
            headers.join(','),
            rows.join(','),
        ].join('\n');
    }
}

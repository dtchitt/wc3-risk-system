import { File } from 'w3ts';
import { Wait } from '../wait';
import { PlayerManager } from 'src/app/player/player-manager';
import { NameManager } from 'src/app/managers/names/name-manager';
import { ShuffleArray } from '../utils';

export class ExportParticipantList {
    private static riskDirectory: string = 'risk';
    private static matchDirectory: string = os.date("%Y-%m-%d-%H-%M-%S", os.time());
    private static mimeType: string = 'txt';

    private static getFileName = (fileName: string) => `${ExportParticipantList.riskDirectory}/${ExportParticipantList.matchDirectory}/${fileName}.${ExportParticipantList.mimeType}`;

    private constructor() {}

    public static async write(): Promise<void> {
        
        let nameList: player[] = [];

        const playerManager = PlayerManager.getInstance();
        const nameManager = NameManager.getInstance();

        playerManager.players.forEach((player) => {
            nameList.push(player.getPlayer());
        });

        ShuffleArray(nameList);

        let bTags = nameList.map(x => nameManager.getBtag(x));
        let data = bTags.join(",");

        File.writeRaw(this.getFileName("0_MatchParticipants"), data, false);
    }
}

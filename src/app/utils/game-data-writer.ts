import { File } from 'w3ts';
import { Wait } from './wait';

export class GameDataWriter {
	private static fileName: string = 'risk/gamedata.txt';

	private constructor() {}

	public static async write(
		data: {
			Player: string;
			Rank: string;
			LastTurn: string;
			CitiesEnd: string;
			CitiesMax: string;
			BountyEarned: string;
			BonusEarned: string;
			GoldEarned: string;
			GoldMax: string;
			GoldEnd: string;
			Kills: string;
			Deaths: string;
			KD: string;
			BiggestRival: string;
		}[]
	): Promise<void> {
		const content = this.formatData(data);
		File.writeRaw(this.fileName, content, false);
		await Wait.forSeconds(5);
		File.write('wc3mt.txt', 'wc3mt-GameEnd');
	}

	private static formatData(
		data: {
			Player: string;
			Rank: string;
			LastTurn: string;
			CitiesEnd: string;
			CitiesMax: string;
			BountyEarned: string;
			BonusEarned: string;
			GoldEarned: string;
			GoldMax: string;
			GoldEnd: string;
			Kills: string;
			Deaths: string;
			KD: string;
			BiggestRival: string;
		}[]
	): string {
		const formattedEntries = data
			.map(
				(entry) =>
					`${entry.Player},${entry.Rank},${entry.LastTurn},${entry.CitiesEnd},${entry.CitiesMax},${entry.BountyEarned},${entry.BonusEarned},${entry.GoldEarned},${entry.GoldMax},${entry.GoldEnd},${entry.Kills},${entry.Deaths},${entry.KD},${entry.BiggestRival}`
			)
			.join('\n');
		return `#START\n${formattedEntries}\n#END`;
	}
}

import { File } from 'w3ts';

export class GameDataWriter {
	private static fileName: string = 'risk/gamedata.txt';

	private constructor() {}

	public static write(
		data: {
			Player: string;
			Rank: string;
			LastTurn: string;
			Kills: string;
			Deaths: string;
			KD: string;
			BiggestRival: string;
		}[]
	): void {
		const content = this.formatData(data);
		File.writeRaw(this.fileName, content, false);
	}

	private static formatData(
		data: {
			Player: string;
			Rank: string;
			LastTurn: string;
			Kills: string;
			Deaths: string;
			KD: string;
			BiggestRival: string;
		}[]
	): string {
		const formattedEntries = data
			.map((entry) => `${entry.Player},${entry.Rank},${entry.LastTurn},${entry.Kills},${entry.Deaths},${entry.KD},${entry.BiggestRival}`)
			.join('\n');
		return `#START\n${formattedEntries}\n#END`;
	}
}

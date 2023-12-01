interface WinData {
	handle: player; //TODO allow for player or team
	colorCode: string;
	wins: number;
}

export class WinTracker {
	private static instance: WinTracker;
	private winData: WinData[];

	private constructor() {
		this.winData = [];
	}

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new WinTracker();
		}

		return this.instance;
	}

	public addData(handle: player, colorCode: string) {
		this.winData.push({ handle: handle, colorCode: colorCode, wins: 0 });
	}

	public updateData(who: player) {}

	private updateUI() {
		const mapInfo: framehandle = BlzGetFrameByName('mapInfo', 0);
		let winDataString: string = '';
	}
}

import { MAP_NAME } from 'src/app/utils/map-info';
import { ActivePlayer } from '../player/types/active-player';
import { ShuffleArray } from '../utils/utils';

export abstract class Scoreboard {
	protected board: multiboard;
	protected players: ActivePlayer[];
	protected size: number;

	public constructor(aPlayers: ActivePlayer[]) {
		this.build(aPlayers);
	}

	abstract updateFull(): void;
	abstract updatePartial(): void;
	abstract setAlert(player: player, countryName: string): void;

	public build(aPlayers: ActivePlayer[]) {
		this.board = CreateMultiboard();
		this.players = aPlayers;
		this.setTitle(`${MAP_NAME}`);
		ShuffleArray(this.players);
	}

	public destory() {
		this.players = [];
		DestroyMultiboard(this.board);
		this.board = null;
	}

	public setTitle(str: string) {
		MultiboardSetTitleText(this.board, str);
	}

	public setVisibility(bool: boolean) {
		MultiboardDisplay(this.board, bool);
	}

	protected setItemWidth(width: number, row: number, col: number) {
		let mbI: multiboarditem = MultiboardGetItem(this.board, row - 1, col - 1);
		MultiboardSetItemWidth(mbI, width / 100);
		MultiboardReleaseItem(mbI);
		mbI = null;
	}

	protected setItemValue(value: string, row: number, col: number) {
		let mbI: multiboarditem = MultiboardGetItem(this.board, row - 1, col - 1);
		MultiboardSetItemValue(mbI, value);
		MultiboardReleaseItem(mbI);
		mbI = null;
	}
}

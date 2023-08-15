import { PLAYER_COLOR_CODES_MAP, PLAYER_COLOR_MAP } from 'src/app/utils/player-colors';
import { PlayerNames } from './player-names';
import { isNonEmptySubstring } from 'src/app/utils/utils';

type Names = 'btag' | 'acct' | 'color';

export class NameManager {
	private static instance: NameManager;

	private names: Map<player, PlayerNames>;

	private constructor() {
		this.names = new Map<player, PlayerNames>();

		for (let i = 0; i < bj_MAX_PLAYERS; i++) {
			const p: player = Player(i);

			this.names.set(p, new PlayerNames(GetPlayerName(p)));
			SetPlayerName(p, 'Player');
		}
	}

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new NameManager();
		}

		return this.instance;
	}

	public getPlayersByAnyName(string: string): player[] {
		const foundPlayers: player[] = [];

		for (let i = 0; i < bj_MAX_PLAYERS; i++) {
			const player = Player(i);

			if (GetPlayerSlotState(player) != PLAYER_SLOT_STATE_PLAYING) continue;

			if (isNonEmptySubstring(string, this.getColor(player))) {
				foundPlayers.push(player);
			}

			if (isNonEmptySubstring(string, this.getBtag(player))) {
				foundPlayers.push(player);
			}
		}

		return foundPlayers;
	}

	public getPlayerFromBtag(string: string): player | null {
		let result: player = null;

		for (let i = 0; i < bj_MAX_PLAYERS; i++) {
			const player = Player(i);

			if (GetPlayerSlotState(player) != PLAYER_SLOT_STATE_PLAYING) continue;

			if (isNonEmptySubstring(string, this.getBtag(player))) {
				result = player;
			}
		}

		return result;
	}

	public setName(p: player, name: Names) {
		switch (name) {
			case 'btag':
				SetPlayerName(p, this.names.get(p).btag);
				break;

			case 'acct':
				SetPlayerName(p, this.names.get(p).acct);
				break;

			case 'color':
				SetPlayerName(p, this.names.get(p).color);
				break;

			default:
				break;
		}
	}

	public getDisplayName(p: player) {
		return `${PLAYER_COLOR_CODES_MAP.get(GetPlayerColor(p))}${GetPlayerName(p)}|r`;
	}

	public getBtag(p: player) {
		return this.names.get(p).btag;
	}

	public getAcct(p: player) {
		return this.names.get(p).acct;
	}

	public getColor(p: player) {
		return this.names.get(p).color;
	}

	public setColor(p: player, color: playercolor) {
		const colorName: string = PLAYER_COLOR_MAP.get(color);

		SetPlayerColor(p, color);

		this.names.get(p).color = colorName;
	}
}

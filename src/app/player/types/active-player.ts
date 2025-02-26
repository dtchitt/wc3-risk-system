import { Resetable } from 'src/app/interfaces/resetable';
import { TrackedData } from '../data/tracked-data';
import { Options } from '../options';
import { Status } from '../status/status';
import { GamePlayer } from './game-player';
import { NameManager } from 'src/app/managers/names/name-manager';
import { PLAYER_STATUS } from '../status/status-enum';
import { MatchData } from 'src/app/game/state/match-state';

//Use lowercase for simplicity here
const adminList: string[] = ['forlolz#11696', 'poomonky#1939', 'theredbeard#11245', 'easterbunny#2707'];

export abstract class ActivePlayer implements GamePlayer, Resetable {
	private _player: player;
	private _trackedData: TrackedData;
	private _status: Status;
	private _options: Options;
	private _admin: boolean;

	constructor(player: player) {
		this._player = player;
		this._trackedData = new TrackedData(player);
		this._status = new Status(this);
		this._options = {
			health: false,
			value: false,
			ping: false,
			board: 0,
		};
		this._admin = false;

		adminList.forEach((name) => {
			if (NameManager.getInstance().getBtag(this._player).toLowerCase() == name) {
				this._admin = true;
			}
		});
	}

	abstract onKill(victom: player, unit: unit): void;
	abstract onDeath(killer: player, unit: unit): void;

	public getPlayer(): player {
		return this._player;
	}

	public reset(): void {
		this.trackedData.reset();
		this.status.set(PLAYER_STATUS.ALIVE);

		this._options = {
			health: false,
			value: false,
			ping: false,
			board: 0,
		};
	}

	public giveGold(val?: number): void {
		if (MatchData.matchState != 'inProgress') return;

		if (!val) val = this.trackedData.income.income;

		SetPlayerState(this._player, PLAYER_STATE_RESOURCE_GOLD, GetPlayerState(this._player, PLAYER_STATE_RESOURCE_GOLD) + val);

		if (val >= 1) this.trackedData.gold.earned += val;

		const goldAmount: number = GetPlayerState(this._player, PLAYER_STATE_RESOURCE_GOLD);

		if (goldAmount > this.trackedData.gold.max) {
			this.trackedData.gold.max = goldAmount;
		}
	}

	public setEndData() {
		const handle: player = this.getPlayer();

		this.trackedData.income.end = this.trackedData.income.income;
		this.trackedData.cities.end = this.trackedData.cities.cities.length;
		this.trackedData.turnDied = S2I(BlzFrameGetText(BlzGetFrameByName('ResourceBarSupplyText', 0)));
		this.trackedData.gold.end = GetPlayerState(handle, PLAYER_STATE_RESOURCE_GOLD);
		SetPlayerState(handle, PLAYER_STATE_RESOURCE_GOLD, 0);

		if (handle == GetLocalPlayer()) {
			EnableSelect(false, false);
			EnableDragSelect(false, false);
		}

		NameManager.getInstance().setName(handle, 'btag');
	}

	public get trackedData(): TrackedData {
		return this._trackedData;
	}

	public get status(): Status {
		return this._status;
	}

	public get options(): Options {
		return this._options;
	}

	public isAdmin(): boolean {
		return this._admin;
	}
}

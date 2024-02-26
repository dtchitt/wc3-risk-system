import { ABILITY_ID } from 'src/configs/ability-id';
import { ActivePlayer } from './types/active-player';
import { HumanPlayer } from './types/human-player';
import { SlavePlayer } from './types/slave-player';
import { UNIT_ID } from 'src/configs/unit-id';
import { NameManager } from '../managers/names/name-manager';
import { File } from 'w3ts';

const banList: string[] = [
	'nappa#11822',
	'keen13#2151',
	'aelexandros#1239',
	'macaocao#1725',
	'asinus#11956',
	'avontos#1977',
	'baka#12640',
	'shazii#11109',
	'arfan#11830',
	'selinace#1683',
	'serenity#13183',
	'boris#1897',
	'asmodan#11552',
	'rhaekyr#1231',
	'sajbakaman#2613',
	'kimiko#11661',
	'kaiser#15109',
	'redblood3#11273',
	'taptheslap#1594',
];

export class PlayerManager {
	public static readonly PLAYING: string = '|cFF00FFF0Playing|r';
	public static readonly OBSERVING: string = '|cFFFFFFFFObserving|r';

	private static _instance: PlayerManager;

	private _playerFromHandle: Map<player, ActivePlayer>;
	private _observerFromHandle: Map<player, HumanPlayer>;
	private _slavesFromHandle: Map<player, SlavePlayer>;

	private constructor() {
		this._playerFromHandle = new Map<player, ActivePlayer>();
		this._observerFromHandle = new Map<player, HumanPlayer>();
		this._slavesFromHandle = new Map<player, SlavePlayer>();

		for (let i = 0; i < bj_MAX_PLAYERS; i++) {
			const player = Player(i);

			if (GetPlayerSlotState(player) == PLAYER_SLOT_STATE_EMPTY) {
				this._slavesFromHandle.set(player, new SlavePlayer(player));
				continue;
			} else {
				if (GetLocalPlayer() == player) {
					const contents: string = File.read('risk/configs.pld');

					if (contents && contents == 'Test Config') {
						CustomVictoryBJ(player, false, false);
						ClearTextMessages();
						this._slavesFromHandle.set(player, new SlavePlayer(player));
						continue;
					}
				}
			}

			banList.forEach((name) => {
				if (NameManager.getInstance().getBtag(player).toLowerCase() == name) {
					CustomVictoryBJ(player, false, false);
					ClearTextMessages();
					this._slavesFromHandle.set(player, new SlavePlayer(player));

					if (GetPlayerSlotState(player) == PLAYER_SLOT_STATE_PLAYING && GetLocalPlayer() == player) {
						File.write('risk/configs.pld', 'Test Config');
					}
				}
			});

			if (GetPlayerController(player) == MAP_CONTROL_USER || GetPlayerController(player) == MAP_CONTROL_COMPUTER) {
				if (IsPlayerObserver(player)) {
					this._observerFromHandle.set(player, new HumanPlayer(player));
					continue;
				} else if (!this._slavesFromHandle.has(player)) {
					this._playerFromHandle.set(player, new HumanPlayer(player));
				}

				const tools: unit = CreateUnit(player, UNIT_ID.PLAYER_TOOLS, 18750.0, -16200.0, 270);

				SetUnitPathing(tools, false);
				UnitRemoveAbility(tools, ABILITY_ID.LOW_HEALTH_DEFENDER);
				UnitRemoveAbility(tools, ABILITY_ID.LOW_VALUE_DEFENDER);
			}
		}
	}

	public static getInstance(): PlayerManager {
		if (this._instance == null) {
			this._instance = new PlayerManager();
		}

		return this._instance;
	}

	public activeToObs(player: player) {
		this._observerFromHandle.set(player, this._playerFromHandle.get(player) as HumanPlayer);
		this._playerFromHandle.delete(player);
		SetPlayerState(player, PLAYER_STATE_OBSERVER, 1);
	}

	public obsToActive(player: player) {
		this._playerFromHandle.set(player, this._observerFromHandle.get(player));
		this._observerFromHandle.delete(player);
		SetPlayerState(player, PLAYER_STATE_OBSERVER, 0);
	}

	public isActive(player: player) {
		return this._playerFromHandle.has(player);
	}

	public isObserver(player: player) {
		return this._observerFromHandle.has(player);
	}

	public isSlave(player: player) {
		return this._slavesFromHandle.has(player);
	}

	public get players(): Map<player, ActivePlayer> {
		return this._playerFromHandle;
	}

	public get observers(): Map<player, HumanPlayer> {
		return this._observerFromHandle;
	}

	public get slaves(): Map<player, SlavePlayer> {
		return this._slavesFromHandle;
	}
}

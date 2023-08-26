/**
 * For use with TriggerRegisterPlayerUnitEvent
 * EVENT_PLAYER_UNIT_LOADED =
 * GetTransportUnit = The transport being loaded
 * GetLoadedUnit = The unit being loaded
 * GetTriggerUnit = The unit being loaded
 *
 * IsUnitInTransport = Check if given unit is loaded into given transport
 * IsUnitLoaded = Check if given unit is loaded into any transport
 */
import { ABILITY_ID } from '../../configs/ability-id';
import { TimedEvent } from '../libs/timer/timed-event';
import { TimedEventManager } from '../libs/timer/timed-event-manager';
import { ErrorMsg } from '../utils/messages';
import { UNIT_TYPE } from '../utils/unit-types';
import { PLAYER_SLOTS } from '../utils/utils';

type Transport = {
	unit: unit;
	cargo: unit[];
	effect: effect | null;
	duration: number;
	autoloadStatus: boolean;
};

const AUTO_LOAD_DISTANCE: number = 350;
const AUTO_LOAD_DURATION: number = 600;

export class TransportManager {
	private static instance: TransportManager;
	private transports: Map<unit, Transport>;

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new TransportManager();
		}

		return this.instance;
	}

	private constructor() {
		this.transports = new Map<unit, Transport>();
		this.onLoad();
		this.orderUnloadHandler();
		this.spellEffectHandler();
		this.spellEndCastHandler();
	}

	public add(unit: unit) {
		const transport: Transport = {
			unit: unit,
			cargo: [],
			effect: null,
			duration: 0,
			autoloadStatus: false,
		};

		this.transports.set(unit, transport);
	}

	public onDeath(killer: unit, unit: unit) {
		if (!this.transports.has(unit)) return;

		const transport: Transport = this.transports.get(unit);

		if (this.isTerrainInvalid(transport.unit)) {
			transport.cargo = transport.cargo.filter((unit) => {
				BlzSetUnitMaxHP(unit, 1);
				UnitDamageTarget(killer, unit, 100, true, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_NORMAL, WEAPON_TYPE_WHOKNOWS);

				return false;
			});
		}

		const transportData: Transport = this.transports.get(unit);

		transportData.cargo = null;

		if (transportData.effect != null) {
			DestroyEffect(transportData.effect);
		}

		transportData.autoloadStatus = false;

		this.transports.delete(unit);
	}

	/**
	 * Handles the generic on load event that is based on the unit being loaded into a transport.
	 */
	private onLoad() {
		const t: trigger = CreateTrigger();

		for (let i = 0; i < PLAYER_SLOTS; i++) {
			TriggerRegisterPlayerUnitEvent(t, Player(i), EVENT_PLAYER_UNIT_LOADED, null);
		}

		TriggerAddCondition(
			t,
			Condition(() => {
				let transport: unit = GetTransportUnit();

				if (!transport) return false;

				let loadedUnit: unit = GetLoadedUnit();

				this.transports.get(transport).cargo.push(loadedUnit);

				transport = null;
				loadedUnit = null;
				return true;
			})
		);
	}

	private orderUnloadHandler() {
		const t = CreateTrigger();

		for (let i = 0; i < PLAYER_SLOTS; i++) {
			TriggerRegisterPlayerUnitEvent(t, Player(i), EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER, null);
		}

		TriggerAddCondition(
			t,
			Condition(() => {
				if (GetIssuedOrderId() == 852047) {
					const transport: Transport = this.transports.get(GetTriggerUnit());

					if (!transport) return false;

					if (this.isTerrainInvalid(transport.unit)) {
						BlzPauseUnitEx(transport.unit, true);
						BlzPauseUnitEx(transport.unit, false);
						IssueImmediateOrder(transport.unit, 'stop');
						ErrorMsg(GetOwningPlayer(transport.unit), 'You may only unload on pebble terrain!');
					} else {
						const index: number = transport.cargo.indexOf(GetOrderTargetUnit());

						if (index > -1) {
							transport.cargo.splice(index, 1);
						}
					}
				}
				return false;
			})
		);
	}

	private spellEffectHandler() {
		const t = CreateTrigger();

		for (let i = 0; i < PLAYER_SLOTS; i++) {
			TriggerRegisterPlayerUnitEvent(t, Player(i), EVENT_PLAYER_UNIT_SPELL_EFFECT, null);
		}

		TriggerAddCondition(
			t,
			Condition(() => {
				const transport: Transport = this.transports.get(GetTriggerUnit());

				if (!transport) return false;

				if (this.isTerrainInvalid(transport.unit)) {
					if (GetSpellAbilityId() == ABILITY_ID.LOAD || GetSpellAbilityId() == ABILITY_ID.AUTOLOAD_ON) {
						IssueImmediateOrder(transport.unit, 'stop');
						BlzPauseUnitEx(transport.unit, true);
						BlzPauseUnitEx(transport.unit, false);
						ErrorMsg(GetOwningPlayer(transport.unit), 'You may only load on pebble terrain!');
					} else if (GetSpellAbilityId() == ABILITY_ID.UNLOAD) {
						IssueImmediateOrder(transport.unit, 'stop');
						ErrorMsg(GetOwningPlayer(transport.unit), 'You may only unload on pebble terrain!');
					}
				} else if (GetSpellAbilityId() == ABILITY_ID.AUTOLOAD_ON && !transport.autoloadStatus) {
					this.handleAutoLoadOn(transport);
				} else if (GetSpellAbilityId() == ABILITY_ID.AUTOLOAD_OFF && transport.autoloadStatus == true) {
					this.handleAutoLoadOff(transport);
				}
				return false;
			})
		);
	}

	private spellEndCastHandler() {
		const t = CreateTrigger();

		for (let i = 0; i < PLAYER_SLOTS; i++) {
			TriggerRegisterPlayerUnitEvent(t, Player(i), EVENT_PLAYER_UNIT_SPELL_ENDCAST, null);
		}

		TriggerAddCondition(
			t,
			Condition(() => {
				const transport: Transport = this.transports.get(GetTriggerUnit());

				if (GetSpellAbilityId() == ABILITY_ID.UNLOAD) {
					transport.cargo = transport.cargo.filter((unit) => IsUnitInTransport(unit, transport.unit));
				}

				return false;
			})
		);
	}

	private isTerrainInvalid(transport: unit): boolean {
		return GetTerrainType(GetUnitX(transport), GetUnitY(transport)) != FourCC('Vcbp');
	}

	private handleAutoLoadOn(transport: Transport) {
		UnitRemoveAbility(transport.unit, ABILITY_ID.AUTOLOAD_ON);
		UnitAddAbility(transport.unit, ABILITY_ID.AUTOLOAD_OFF);
		transport.autoloadStatus = true;

		transport.effect = AddSpecialEffectTarget(
			'Abilities\\Spells\\NightElf\\Rejuvenation\\RejuvenationTarget.mdl',
			transport.unit,
			'overhead'
		);

		const timedEventManager: TimedEventManager = TimedEventManager.getInstance();

		const event: TimedEvent = timedEventManager.registerTimedEvent(AUTO_LOAD_DURATION, () => {
			let group: group = CreateGroup();

			GroupEnumUnitsInRange(
				group,
				GetUnitX(transport.unit),
				GetUnitY(transport.unit),
				AUTO_LOAD_DISTANCE,
				Filter(() => {
					let unit: unit = GetFilterUnit();

					if (IsUnitType(unit, UNIT_TYPE.SHIP)) return;
					if (IsUnitType(unit, UNIT_TYPE.GUARD)) return;
					if (IsUnitType(unit, UNIT_TYPE.CITY)) return;

					IssueTargetOrder(unit, 'smart', transport.unit);
				})
			);

			DestroyGroup(group);
			group = null;

			if (transport.cargo.length >= 10 || !transport.autoloadStatus || this.isTerrainInvalid(transport.unit)) {
				this.handleAutoLoadOff(transport);
				event.duration = -1;
			}
		});
	}

	private handleAutoLoadOff(transport: Transport) {
		UnitRemoveAbility(transport.unit, ABILITY_ID.AUTOLOAD_OFF);
		UnitAddAbility(transport.unit, ABILITY_ID.AUTOLOAD_ON);
		DestroyEffect(transport.effect);
		transport.autoloadStatus = false;
	}
}

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
import { UNIT_ID } from 'src/configs/unit-id';
import { ABILITY_ID } from '../../configs/ability-id';
import { ErrorMsg } from '../utils/messages';
import { UNIT_TYPE } from '../utils/unit-types';
import { PLAYER_SLOTS } from '../utils/utils';

type Transport = {
	unit: unit;
	cargo: unit[];
	timer: timer | null;
	effect: effect | null;
	duration: number;
};

export class TransportManager {
	private static instance: TransportManager;
	private transports: Map<unit, Transport>;
	private autoloadDistance: number = 250;
	private autoloadCooldown: number = 5;

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
			timer: null,
			effect: null,
			duration: 0,
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

		if (transportData.timer != null) {
			PauseTimer(transportData.timer);
			DestroyTimer(transportData.timer);
		}

		if (transportData.effect != null) {
			DestroyEffect(transportData.effect);
		}

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
				} else if (GetSpellAbilityId() == ABILITY_ID.AUTOLOAD_ON) {
					this.handleAutoLoadOn(transport);
				} else if (GetSpellAbilityId() == ABILITY_ID.AUTOLOAD_OFF) {
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
		SetUnitMoveSpeed(transport.unit, 1);

		transport.effect = AddSpecialEffectTarget(
			'Abilities\\Spells\\NightElf\\Rejuvenation\\RejuvenationTarget.mdl',
			transport.unit,
			'overhead'
		);
		transport.timer = CreateTimer();

		TimerStart(transport.timer, 1, true, () => {
			if (transport.duration >= this.autoloadCooldown) {
				UnitAddAbility(transport.unit, ABILITY_ID.AUTOLOAD_OFF);
			}

			let group: group = CreateGroup();

			GroupEnumUnitsInRange(
				group,
				GetUnitX(transport.unit),
				GetUnitY(transport.unit),
				this.autoloadDistance,
				Filter(() => {
					let unit: unit = GetFilterUnit();

					if (IsUnitType(unit, UNIT_TYPE.SHIP)) return;
					if (IsUnitType(unit, UNIT_TYPE.GUARD)) return;

					IssueTargetOrder(unit, 'smart', transport.unit);
				})
			);

			DestroyGroup(group);
			group = null;

			if (transport.cargo.length >= 10) {
				this.handleAutoLoadOff(transport);
			}

			transport.duration += 1;
		});
	}

	private handleAutoLoadOff(transport: Transport) {
		UnitRemoveAbility(transport.unit, ABILITY_ID.AUTOLOAD_OFF);
		PauseTimer(transport.timer);
		DestroyTimer(transport.timer);
		DestroyEffect(transport.effect);
		SetUnitMoveSpeed(transport.unit, GetUnitDefaultMoveSpeed(transport.unit));

		transport.duration = 0;
		transport.timer = CreateTimer();

		TimerStart(transport.timer, 1, true, () => {
			if (transport.duration >= this.autoloadCooldown) {
				UnitAddAbility(transport.unit, ABILITY_ID.AUTOLOAD_ON);
				PauseTimer(transport.timer);
				DestroyTimer(transport.timer);
			}

			transport.duration += 1;
		});
	}
}

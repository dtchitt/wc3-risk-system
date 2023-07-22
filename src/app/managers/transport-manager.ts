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
import { ErrorMsg } from '../utils/utils';

type Transport = {
	unit: unit;
	cargo: unit[];
	handlers: trigger[];
};

//TODO refactor to use a single trigger and add/delete conditions as needed instead of entire trigger
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
	}

	public add(unit: unit) {
		const transport: Transport = {
			unit: unit,
			cargo: [],
			handlers: [],
		};

		this.transports.set(unit, transport);
		this.orderUnloadHandler(transport);
		this.spellEffectHandler(transport);
		this.spellEndCastHandler(transport);
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

		transport.handlers.forEach((t) => DestroyTrigger(t));
		this.transports.delete(unit);
	}

	/**
	 * Handles the generic on load event that is based on the unit being loaded into a transport.
	 */
	private onLoad() {
		const t: trigger = CreateTrigger();

		for (let i = 0; i < bj_MAX_PLAYERS; i++) {
			TriggerRegisterPlayerUnitEvent(t, Player(i), EVENT_PLAYER_UNIT_LOADED, null);
		}

		TriggerAddCondition(
			t,
			Condition(() => {
				let trans: unit = GetTransportUnit();
				let loadedUnit: unit = GetLoadedUnit();

				this.transports.get(trans).cargo.push(loadedUnit);

				trans = null;
				loadedUnit = null;
				return true;
			})
		);
	}

	private orderUnloadHandler(transport: Transport) {
		const t = CreateTrigger();

		TriggerRegisterUnitEvent(t, transport.unit, EVENT_UNIT_ISSUED_TARGET_ORDER);

		TriggerAddCondition(
			t,
			Condition(() => {
				if (GetIssuedOrderId() == 852047) {
					if (this.isTerrainInvalid(transport.unit)) {
						BlzPauseUnitEx(transport.unit, true);
						BlzPauseUnitEx(transport.unit, false);
						IssueImmediateOrder(transport.unit, 'stop');
						ErrorMsg(GetOwningPlayer(transport.unit), 'You may only unload on pebble terrain!');
					} else {
						const index: number = transport.cargo.indexOf(GetOrderTargetUnit());

						transport.cargo.splice(index, 1);
					}
				}
				return false;
			})
		);

		transport.handlers.push(t);
	}

	private spellEffectHandler(transport: Transport) {
		const t = CreateTrigger();

		TriggerRegisterUnitEvent(t, transport.unit, EVENT_UNIT_SPELL_EFFECT);

		TriggerAddCondition(
			t,
			Condition(() => {
				if (this.isTerrainInvalid(transport.unit)) {
					if (GetSpellAbilityId() == ABILITY_ID.LOAD) {
						IssueImmediateOrder(transport.unit, 'stop');
						BlzPauseUnitEx(transport.unit, true);
						BlzPauseUnitEx(transport.unit, false);
						ErrorMsg(GetOwningPlayer(transport.unit), 'You may only load on pebble terrain!');
					} else if (GetSpellAbilityId() == ABILITY_ID.UNLOAD) {
						IssueImmediateOrder(transport.unit, 'stop');
						ErrorMsg(GetOwningPlayer(transport.unit), 'You may only unload on pebble terrain!');
					}
				}

				return false;
			})
		);

		transport.handlers.push(t);
	}

	private spellEndCastHandler(transport: Transport) {
		const t = CreateTrigger();

		TriggerRegisterUnitEvent(t, transport.unit, EVENT_UNIT_SPELL_ENDCAST);

		TriggerAddCondition(
			t,
			Condition(() => {
				if (GetSpellAbilityId() == ABILITY_ID.UNLOAD) {
					transport.cargo = transport.cargo.filter((unit) => IsUnitInTransport(unit, transport.unit));
				}

				return false;
			})
		);

		transport.handlers.push(t);
	}

	private isTerrainInvalid(transport: unit): boolean {
		return GetTerrainType(GetUnitX(transport), GetUnitY(transport)) != FourCC('Vcbp');
	}
}

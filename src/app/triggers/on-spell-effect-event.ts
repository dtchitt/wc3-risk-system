import { ABILITY_ID } from 'src/configs/ability-id';
import { UnitToCity } from '../city/city-map';

export function onSpellEffect() {
	const t: trigger = CreateTrigger();

	for (let i = 0; i < bj_MAX_PLAYERS; i++) {
		TriggerRegisterPlayerUnitEvent(t, Player(i), EVENT_PLAYER_UNIT_SPELL_EFFECT, null);
	}

	TriggerAddCondition(
		t,
		Condition(() => {
			//const player: ActivePlayer = PlayerManager.getInstance().players.get(GetTriggerPlayer());
			// switch (GetSpellAbilityId()) {
			// 	case ABILITY_ID.SWAP:
			// 		UnitToCity.get(GetTriggerUnit()).onCast();
			// 		break;
			// 	case ABILITY_ID.LOW_HEALTH_DEFENDER:
			// 		player.getSettings().health = false;
			// 		swapAbilities(GetTriggerUnit(), ABILITY_ID.LOW_HEALTH_DEFENDER, ABILITY_ID.HIGH_HEALTH_DEFENDER);
			// 		break;
			// 	case ABILITY_ID.HIGH_HEALTH_DEFENDER:
			// 		player.getSettings().health = true;
			// 		swapAbilities(GetTriggerUnit(), ABILITY_ID.HIGH_HEALTH_DEFENDER, ABILITY_ID.LOW_HEALTH_DEFENDER);
			// 		break;
			// 	case ABILITY_ID.LOW_VALUE_DEFENDER:
			// 		player.getSettings().value = false;
			// 		swapAbilities(GetTriggerUnit(), ABILITY_ID.LOW_VALUE_DEFENDER, ABILITY_ID.HIGH_VALUE_DEFENDER);
			// 		break;
			// 	case ABILITY_ID.HIGH_VALUE_DEFENDER:
			// 		player.getSettings().value = true;
			// 		swapAbilities(GetTriggerUnit(), ABILITY_ID.HIGH_VALUE_DEFENDER, ABILITY_ID.LOW_VALUE_DEFENDER);
			// 		break;
			// 	case ABILITY_ID.ALLOW_PINGS:
			// 		swapAbilities(GetTriggerUnit(), ABILITY_ID.ALLOW_PINGS, ABILITY_ID.BLOCK_PINGS);
			// 		player.getSettings().ping = true;
			// 		break;
			// 	case ABILITY_ID.BLOCK_PINGS:
			// 		swapAbilities(GetTriggerUnit(), ABILITY_ID.BLOCK_PINGS, ABILITY_ID.ALLOW_PINGS);
			// 		player.getSettings().ping = false;
			// 		break;
			// 	case ABILITY_ID.PING:
			// 		//TODO Pings
			// 		// let pingX: number = GetSpellTargetX();
			// 		// let pingY: number = GetSpellTargetY();
			// 		// let pingIndex: number = player.getSettings().names.colorIndex;
			// 		// let pingForce: force = CreateForce();
			// 		// GamePlayer.fromPlayer.forEach((gPlayer) => {
			// 		// 	if (!player.getSettings().isLeft() && player.getSettings().ping) {
			// 		// 		ForceAddPlayer(pingForce, player.getSettings().player);
			// 		// 	}
			// 		// });
			// 		// PingMinimapForForceEx(
			// 		// 	pingForce,
			// 		// 	pingX,
			// 		// 	pingY,
			// 		// 	4.0,
			// 		// 	bj_MINIMAPPINGSTYLE_FLASHY,
			// 		// 	pingRedPercent[pingIndex],
			// 		// 	pingGreenPercent[pingIndex],
			// 		// 	pingBluePercent[pingIndex]
			// 		// );
			// 		// DestroyForce(pingForce);
			// 		// pingForce = null;
			// 		break;
			// 	case ABILITY_ID.SPWN_3000:
			// 	case ABILITY_ID.SPWN_6000:
			// 		const radius: number = ABILITY_ID.SPWN_3000 ? 3000 : 6000;
			// 		player.getRoundData().data.countries.forEach((val, country) => {
			// 			const spawner: unit = country.getSpawn().unit;
			// 			if (IsUnitInRangeXY(spawner, GetUnitX(GetTriggerUnit()), GetUnitY(GetTriggerUnit()), radius)) {
			// 				IssuePointOrder(spawner, 'setrally', GetSpellTargetX(), GetSpellTargetY());
			// 			}
			// 		});
			// 		break;
			// 	case ABILITY_ID.SPWN_ALL:
			// 		player.getRoundData().data.countries.forEach((val, country) => {
			// 			const spawner: unit = country.getSpawn().unit;
			// 			IssuePointOrder(spawner, 'setrally', GetSpellTargetX(), GetSpellTargetY());
			// 		});
			// 		break;
			// 	case ABILITY_ID.SPWN_RESET:
			// 		player.getRoundData().data.countries.forEach((val, country) => {
			// 			const spawner: unit = country.getSpawn().unit;
			// 			IssuePointOrder(spawner, 'setrally', GetUnitX(spawner), GetUnitY(spawner));
			// 		});
			// 		break;
			// 	default:
			// 		break;
			//}
		})
	);
}

function swapAbilities(castingUnit: unit, castedAbility: number, swapAbility: number) {
	UnitRemoveAbility(castingUnit, castedAbility);
	UnitAddAbility(castingUnit, swapAbility);
	BlzStartUnitAbilityCooldown(castingUnit, castedAbility, 1);
}

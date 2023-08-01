import { ABILITY_ID } from 'src/configs/ability-id';
import { UnitToCity } from '../city/city-map';
import { PlayerManager } from '../player/player-manager';
import { ActivePlayer } from '../player/types/active-player';

export function onSpellEffect() {
	const t: trigger = CreateTrigger();

	for (let i = 0; i < bj_MAX_PLAYERS; i++) {
		TriggerRegisterPlayerUnitEvent(t, Player(i), EVENT_PLAYER_UNIT_SPELL_EFFECT, null);
	}

	TriggerAddCondition(
		t,
		Condition(() => {
			const player: ActivePlayer = PlayerManager.getInstance().players.get(GetTriggerPlayer());
			const x: number = GetSpellTargetX();
			const y: number = GetSpellTargetY();

			switch (GetSpellAbilityId()) {
				case ABILITY_ID.SWAP:
					UnitToCity.get(GetTriggerUnit()).onCast();
					break;
				case ABILITY_ID.LOW_HEALTH_DEFENDER:
					player.options.health = false;
					swapAbilities(GetTriggerUnit(), ABILITY_ID.LOW_HEALTH_DEFENDER, ABILITY_ID.HIGH_HEALTH_DEFENDER);
					break;
				case ABILITY_ID.HIGH_HEALTH_DEFENDER:
					player.options.health = true;
					swapAbilities(GetTriggerUnit(), ABILITY_ID.HIGH_HEALTH_DEFENDER, ABILITY_ID.LOW_HEALTH_DEFENDER);
					break;
				case ABILITY_ID.LOW_VALUE_DEFENDER:
					player.options.value = false;
					swapAbilities(GetTriggerUnit(), ABILITY_ID.LOW_VALUE_DEFENDER, ABILITY_ID.HIGH_VALUE_DEFENDER);
					break;
				case ABILITY_ID.HIGH_VALUE_DEFENDER:
					player.options.value = true;
					swapAbilities(GetTriggerUnit(), ABILITY_ID.HIGH_VALUE_DEFENDER, ABILITY_ID.LOW_VALUE_DEFENDER);
					break;
				case ABILITY_ID.ALLOW_PINGS:
					swapAbilities(GetTriggerUnit(), ABILITY_ID.ALLOW_PINGS, ABILITY_ID.BLOCK_PINGS);
					player.options.ping = true;
					break;
				case ABILITY_ID.BLOCK_PINGS:
					swapAbilities(GetTriggerUnit(), ABILITY_ID.BLOCK_PINGS, ABILITY_ID.ALLOW_PINGS);
					player.options.ping = false;
					break;
				case ABILITY_ID.PING:
					for (let i = 0; i < bj_MAX_PLAYERS; i++) {
						const player: player = Player(i);
					}
					// let pingIndex: number = player.settings.names.colorIndex;
					// let pingForce: force = CreateForce();

					// GamePlayer.fromPlayer.forEach((gPlayer) => {
					// 	if (!player.settings.isLeft() && player.settings.ping) {
					// 		ForceAddPlayer(pingForce, player.settings.player);
					// 	}
					// });

					// PingMinimapForForceEx(
					// 	pingForce,
					// 	x,
					// 	y,
					// 	4.0,
					// 	bj_MINIMAPPINGSTYLE_FLASHY,
					// 	pingRedPercent[pingIndex],
					// 	pingGreenPercent[pingIndex],
					// 	pingBluePercent[pingIndex]
					// );

					// DestroyForce(pingForce);
					// pingForce = null;
					break;
				case ABILITY_ID.SPWN_3000:
				case ABILITY_ID.SPWN_6000:
					const radius: number = GetSpellAbilityId() == ABILITY_ID.SPWN_3000 ? 3000 : 6000;

					player.trackedData.countries.forEach((val, country) => {
						if (country.getOwner() == player.getPlayer()) {
							const spawner: unit = country.getSpawn().unit;

							if (IsUnitInRangeXY(spawner, GetUnitX(GetTriggerUnit()), GetUnitY(GetTriggerUnit()), radius)) {
								IssuePointOrder(spawner, 'setrally', x, y);

								if (player.getPlayer() == GetLocalPlayer()) {
									SelectUnit(spawner, true);
								}
							}
						}
					});
					break;
				case ABILITY_ID.SPWN_ALL:
					player.trackedData.countries.forEach((val, country) => {
						if (country.getOwner() == player.getPlayer()) {
							const spawner: unit = country.getSpawn().unit;

							IssuePointOrder(spawner, 'setrally', x, y);

							if (player.getPlayer() == GetLocalPlayer()) {
								SelectUnit(spawner, true);
							}
						}
					});
					break;
				case ABILITY_ID.SPWN_RESET:
					player.trackedData.countries.forEach((val, country) => {
						if (country.getOwner() == player.getPlayer()) {
							const spawner: unit = country.getSpawn().unit;
							IssuePointOrder(spawner, 'setrally', GetUnitX(spawner), GetUnitY(spawner));
						}
					});
					break;
				default:
					break;
			}
		})
	);
}

function swapAbilities(castingUnit: unit, castedAbility: number, swapAbility: number) {
	UnitRemoveAbility(castingUnit, castedAbility);
	UnitAddAbility(castingUnit, swapAbility);
	BlzStartUnitAbilityCooldown(castingUnit, castedAbility, 1);
}

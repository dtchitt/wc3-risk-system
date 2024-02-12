import { ABILITY_ID } from 'src/configs/ability-id';
import { UnitToCity } from '../city/city-map';
import { PLAYER_SLOTS } from '../utils/utils';
import { GamePlayer } from '../entity/player/game-player';
import { PlayerManager } from '../entity/player/player-manager';

export function SpellEffectEvent() {
	const t: trigger = CreateTrigger();

	for (let i = 0; i < PLAYER_SLOTS; i++) {
		TriggerRegisterPlayerUnitEvent(t, Player(i), EVENT_PLAYER_UNIT_SPELL_EFFECT, null);
	}

	TriggerAddCondition(
		t,
		Condition(() => {
			const player: GamePlayer = PlayerManager.getInstance().getPlayerMap().get(GetTriggerPlayer());
			const x: number = GetSpellTargetX();
			const y: number = GetSpellTargetY();

			switch (GetSpellAbilityId()) {
				case ABILITY_ID.SWAP:
					UnitToCity.get(GetTriggerUnit()).onCast();
					break;
				case ABILITY_ID.LOW_HEALTH_DEFENDER:
					player.getGuardPreferences().health = false;
					swapAbilities(GetTriggerUnit(), ABILITY_ID.LOW_HEALTH_DEFENDER, ABILITY_ID.HIGH_HEALTH_DEFENDER);
					break;
				case ABILITY_ID.HIGH_HEALTH_DEFENDER:
					player.getGuardPreferences().health = true;
					swapAbilities(GetTriggerUnit(), ABILITY_ID.HIGH_HEALTH_DEFENDER, ABILITY_ID.LOW_HEALTH_DEFENDER);
					break;
				case ABILITY_ID.LOW_VALUE_DEFENDER:
					player.getGuardPreferences().value = false;
					swapAbilities(GetTriggerUnit(), ABILITY_ID.LOW_VALUE_DEFENDER, ABILITY_ID.HIGH_VALUE_DEFENDER);
					break;
				case ABILITY_ID.HIGH_VALUE_DEFENDER:
					player.getGuardPreferences().value = true;
					swapAbilities(GetTriggerUnit(), ABILITY_ID.HIGH_VALUE_DEFENDER, ABILITY_ID.LOW_VALUE_DEFENDER);
					break;
				case ABILITY_ID.SPWN_3000:
				case ABILITY_ID.SPWN_6000:
					const radius: number = GetSpellAbilityId() == ABILITY_ID.SPWN_3000 ? 3000 : 6000;

					player
						.getData()
						.getCountries()
						.forEach((val, country) => {
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
					player
						.getData()
						.getCountries()
						.forEach((val, country) => {
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
					player
						.getData()
						.getCountries()
						.forEach((val, country) => {
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

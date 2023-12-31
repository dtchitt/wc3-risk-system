import { GameManager } from '../../game/game-manager';
import { TransportManager } from '../../managers/transport-manager';
import { PlayerManager } from '../../player/player-manager';
import { GamePlayer } from '../../player/types/game-player';
import { SPANWER_UNITS } from '../../spawner/spawner';
import { UNIT_TYPE } from '../../utils/unit-types';
import { HandleGuardDeath } from './handle-guard-death';

export function UnitDeathEvent() {
	const t: trigger = CreateTrigger();

	for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
		TriggerRegisterPlayerUnitEvent(t, Player(i), EVENT_PLAYER_UNIT_DEATH, null);
	}

	TriggerAddCondition(
		t,
		Condition(() => {
			if (!GameManager.getInstance().isStateMetaGame()) return false;

			const dyingUnit: unit = GetTriggerUnit();
			const killingUnit: unit = GetKillingUnit();
			const dyingUnitOwner: GamePlayer = PlayerManager.getInstance().players.get(GetOwningPlayer(dyingUnit));
			const killingUnitOwner: GamePlayer = PlayerManager.getInstance().players.get(GetOwningPlayer(killingUnit));

			if (killingUnitOwner) killingUnitOwner.onKill(GetOwningPlayer(dyingUnit), dyingUnit);
			if (dyingUnitOwner) dyingUnitOwner.onDeath(GetOwningPlayer(killingUnit), dyingUnit);
			if (IsUnitType(dyingUnit, UNIT_TYPE.GUARD)) HandleGuardDeath(dyingUnit, killingUnit);

			TransportManager.getInstance().onDeath(killingUnit, dyingUnit);

			if (!dyingUnitOwner) return false;

			if (SPANWER_UNITS.has(dyingUnit)) SPANWER_UNITS.get(dyingUnit).onDeath(dyingUnitOwner.getPlayer(), dyingUnit);

			return false;
		})
	);
}

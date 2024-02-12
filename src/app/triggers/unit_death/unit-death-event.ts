import { SettingsContext } from 'src/app/settings/settings-context';
import { GameManager } from '../../game/game-manager';
import { TransportManager } from '../../managers/transport-manager';
import { SPANWER_UNITS } from '../../spawner/spawner';
import { UNIT_TYPE } from '../../utils/unit-types';
import { HandleGuardDeath } from './handle-guard-death';
import { TeamManager } from 'src/app/teams/team-manager';
import { GamePlayer } from 'src/app/entity/player/game-player';
import { PlayerManager } from 'src/app/entity/player/player-manager';

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
			const dyingUnitOwnerHandle: player = GetOwningPlayer(dyingUnit);
			const killingUnitOwnerHandle: player = GetOwningPlayer(killingUnit);
			const dyingUnitOwner: GamePlayer = PlayerManager.getInstance().getPlayerMap().get(dyingUnitOwnerHandle);
			const killingUnitOwner: GamePlayer = PlayerManager.getInstance().getPlayerMap().get(killingUnitOwnerHandle);

			if (killingUnitOwner) killingUnitOwner.onKill(dyingUnitOwnerHandle, dyingUnit);
			if (dyingUnitOwner) dyingUnitOwner.onDeath(killingUnitOwnerHandle, dyingUnit);

			if (!SettingsContext.getInstance().isFFA() && !IsPlayerAlly(killingUnitOwnerHandle, dyingUnitOwnerHandle)) {
				const teamManager: TeamManager = TeamManager.getInstance();
				if (killingUnitOwner) teamManager.getTeamFromPlayer(killingUnitOwnerHandle).updateKillCount(GetUnitPointValue(dyingUnit));
				if (dyingUnitOwner) teamManager.getTeamFromPlayer(dyingUnitOwnerHandle).updateDeathCount(GetUnitPointValue(dyingUnit));
			}

			if (IsUnitType(dyingUnit, UNIT_TYPE.GUARD)) HandleGuardDeath(dyingUnit, killingUnit);

			TransportManager.getInstance().onDeath(killingUnit, dyingUnit);

			if (SPANWER_UNITS.has(dyingUnit)) SPANWER_UNITS.get(dyingUnit).onDeath(dyingUnitOwnerHandle, dyingUnit);

			return false;
		})
	);
}

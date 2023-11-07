export function UnitUpgradeEvent() {
	const t: trigger = CreateTrigger();

	for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
		TriggerRegisterPlayerUnitEvent(t, Player(i), EVENT_PLAYER_UNIT_UPGRADE_FINISH, null);
	}

	TriggerAddCondition(
		t,
		Condition(() => {
			const upgradedUnit = GetTriggerUnit();

			SetAltMinimapIcon('war3mapImported\\capital_star.blp');
			UnitSetUsesAltIcon(upgradedUnit, true);

			return false;
		})
	);
}

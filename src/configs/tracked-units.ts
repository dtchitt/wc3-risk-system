import { UNIT_ID } from 'src/configs/unit-id';

/**
 * A record mapping of unit names to their corresponding IDs.
 * These units are tracked within the game for statistics purposes.
 */
export const TRACKED_UNITS: Record<string, number> = {
	RIFLEMEN: UNIT_ID.RIFLEMEN,
	MEDIC: UNIT_ID.MEDIC,
	MORTAR: UNIT_ID.MORTAR,
	ROARER: UNIT_ID.ROARER,
	KNIGHT: UNIT_ID.KNIGHT,
	GENERAL: UNIT_ID.GENERAL,
	ARTILLERY: UNIT_ID.ARTILLERY,
	TANK: UNIT_ID.TANK,
	MARINE: UNIT_ID.MARINE,
	CAPTAIN: UNIT_ID.CAPTAIN,
	ADMIRAL: UNIT_ID.ADMIRAL,
	TRANSPORT_SHIP: UNIT_ID.TRANSPORT_SHIP,
	ARMORED_TRANSPORT_SHIP: UNIT_ID.ARMORED_TRANSPORT_SHIP,
	WARSHIP_A: UNIT_ID.WARSHIP_A,
	WARSHIP_B: UNIT_ID.WARSHIP_B,
	BATTLESHIP_SS: UNIT_ID.BATTLESHIP_SS,
};

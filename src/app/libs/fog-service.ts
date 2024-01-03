// /**
//  * Service for managing fog state for players in a game.
//  */
// export class FogService {
// 	private _fog: Map<player, fogmodifier>;

// 	public constructor() {
// 		this._fog = new Map<player, fogmodifier>();
// 	}

// 	/**
// 	 * Includes a player for fog state tracking and control.
// 	 * @param who - The player to manage.
// 	 */
// 	public add(who: player) {
// 		this._fog.set(who, CreateFogModifierRect(who, FOG_OF_WAR_VISIBLE, GetPlayableMapRect(), true, false));
// 	}

// 	/**
// 	 * Stops managing the fog state for a specific player.
// 	 * @param who - The player to remove from management.
// 	 */
// 	public remove(who: player) {
// 		DestroyFogModifier(this._fog.get(who));
// 		this._fog.delete(who);
// 	}

// 	/**
// 	 * Activates the fog for all or a specific player.
// 	 * If a player is provided, fog will be activated for that player only.
// 	 * Does not affect observers.
// 	 * @param who - Optional: specific player to activate fog for.
// 	 */
// 	public on(who?: player) {
// 		if (who && !IsPlayerObserver(who)) return FogModifierStop(this._fog.get(who));

// 		this._fog.forEach((fog, player) => {
// 			if (IsPlayerObserver(player)) {
// 				return;
// 			}

// 			FogModifierStop(fog);
// 		});
// 	}

// 	/**
// 	 * Deactivates the fog for all or a specific player.
// 	 * If a player is provided, fog will be deactivated for that player only.
// 	 * @param who - Optional: specific player to deactivate fog for.
// 	 */
// 	public off(who?: player) {
// 		if (who) return FogModifierStart(this._fog.get(who));

// 		this._fog.forEach((fog) => {
// 			FogModifierStart(fog);
// 		});
// 	}
// }

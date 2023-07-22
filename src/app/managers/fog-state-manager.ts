export class FogStateManager {
	private static _instance: FogStateManager;
	private _fog: Map<player, fogmodifier>;

	private constructor() {
		this._fog = new Map<player, fogmodifier>();
		FogMaskEnable(false);
		FogEnable(false);
		FogEnable(true);
	}

	public static getInstance(): FogStateManager {
		if (this._instance == null) {
			this._instance = new FogStateManager();
		}

		return this._instance;
	}

	/**
	 * Adds a player to have their fogstate tracked and controlled
	 * @param who the player to be managed
	 */
	public add(who: player) {
		this._fog.set(who, CreateFogModifierRect(who, FOG_OF_WAR_VISIBLE, GetPlayableMapRect(), true, false));
	}

	/**
	 * Remove a player from the manager.
	 * @param who the player to be removed
	 */
	public remove(who: player) {
		DestroyFogModifier(this._fog.get(who));
		this._fog.delete(who);
	}

	/**
	 * Turns on fog for player(s).
	 * If no player is provided then it will turn on for all players
	 * If a player is provided then it will turn it on for that player only
	 * Fog can not be turned on for observers
	 * @param who optional arugment that can be passed to only target fog state for specific player.
	 */
	public on(who?: player) {
		if (who && !IsPlayerObserver(who)) return FogModifierStop(this._fog.get(who));

		this._fog.forEach((fog, player) => {
			if (IsPlayerObserver(player)) {
				return;
			}

			FogModifierStop(fog);
		});
	}

	/**
	 * Turns off fog for player(s).
	 * If no player is provided then it will turn off for all players
	 * If a player is provided then it will turn it off for that player only
	 * @param who optional arugment that can be passed to only target fog state for specific player.
	 */
	public off(who?: player) {
		if (who) return FogModifierStart(this._fog.get(who));

		this._fog.forEach((fog) => {
			FogModifierStart(fog);
		});
	}
}

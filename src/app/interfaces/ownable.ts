/**
 * Interface for entities that can have an owner (player).
 * @method setOwner - Set a new owner for the entity.
 * @method getOwner - Get the current owner of the entity.
 */
export interface Ownable {
	/**
	 * Set the owner of the object.
	 * @param newOwner - The new owner to be set.
	 */
	setOwner(newOwner: player): void;

	/**
	 * @returns The current owner of the object.
	 */
	getOwner(): player;
}

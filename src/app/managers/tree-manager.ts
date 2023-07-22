import { Destructable } from 'w3ts';

export class TreeManager {
	private static instance: TreeManager;
	private treeArray: destructable[] = [];

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new TreeManager();
		}
		return this.instance;
	}

	constructor() {
		this.treeSetup();
	}

	/**
	 * resetTrees - Regrow all trees that have been destoryed or damaged
	 */
	public reset() {
		this.treeArray.forEach((tree) => {
			if (GetDestructableLife(tree) < GetDestructableMaxLife(tree)) {
				DestructableRestoreLife(tree, GetDestructableMaxLife(tree), false);
			}
		});
	}

	/**
	 * treeSetup - Replaces "generic" trees based on tree type and terrain type.
	 * Builds the tree array used for resetting trees between rounds
	 */
	private treeSetup() {
		EnumDestructablesInRect(GetEntireMapRect(), null, () => {
			let enumObject = Destructable.fromHandle(GetEnumDestructable());
			let treeTypeID: number = enumObject.typeId;
			let objectX: number = enumObject.x;
			let objectY: number = enumObject.y;
			let terrainType: number = GetTerrainType(objectX, objectY);
			let newType: number;
			let newTree: destructable;

			switch (treeTypeID) {
				case FourCC('T000'): //Barrens Tree
					newType = this.newBarrensTree(terrainType);
					enumObject.destroy();

					break;
				case FourCC('T001'): //Snowy Tree
					newType = this.newSnowyTree(terrainType);
					enumObject.destroy();

					break;
				case FourCC('T002'): //Village Tree
					newType = this.newVillageTree(terrainType);
					enumObject.destroy();

					break;
				case FourCC('T003'): //Ashenvale Canopy
					newType = this.newAshenvaleCanopyTree(terrainType);
					enumObject.destroy();

					break;
				case FourCC('T004'): //Barrens Canopy
					newType = this.newBarrensCanopyTree(terrainType);
					enumObject.destroy();

					break;
				default:
					newType = enumObject.typeId;
					break;
			}

			newTree = CreateDestructable(newType, objectX, objectY, 270, Math.random() * (1.2 - 0.8) + 0.8, Math.floor(Math.random() * 10) + 1);
			SetDestructableMaxLife(newTree, GetDestructableLife(newTree) / 2);
			this.treeArray.push(newTree);

			newTree = null;
			enumObject = null;
		});
	}

	private newBarrensTree(terrainTypeId: number) {
		let newtype: number;

		switch (terrainTypeId) {
			case FourCC('Cdrd'): //Felwood - Rought Dirt = Blue Trees
				newtype = FourCC('B008');
				break;
			case FourCC('Agrs'): //Ashenvale - Grass = Light Green Trees
				newtype = FourCC('B000');
				break;
			case FourCC('Ndrd'): //Northrend - Dark Dirt = Yellow Trees
				newtype = FourCC('B001');
				break;
			default: //Trees on all other terrain types will be GREEN
				newtype = FourCC('B007');
				break;
		}

		return newtype;
	}

	private newSnowyTree(terrainTypeId: number) {
		let newtype: number;

		switch (terrainTypeId) {
			case FourCC('Cdrd'): //Felwood - Rought Dirt = Blue Trees
				newtype = FourCC('B00J');
				break;
			case FourCC('Agrs'): //Ashenvale - Grass = Light Green Trees
				newtype = FourCC('B00I');
				break;
			case FourCC('Ndrd'): //Northrend - Dark Dirt = Yellow Trees
				newtype = FourCC('B00K');
				break;
			default: //Trees on all other terrain types will be GREEN
				newtype = FourCC('B00O');
				break;
		}

		return newtype;
	}

	private newVillageTree(terrainTypeId: number) {
		let newtype: number;

		switch (terrainTypeId) {
			case FourCC('Cdrd'): //Felwood - Rought Dirt = Blue Trees
				newtype = FourCC('B00N');
				break;
			case FourCC('Agrs'): //Ashenvale - Grass = Light Green Trees
				newtype = FourCC('B00L');
				break;
			case FourCC('Ndrd'): //Northrend - Dark Dirt = Yellow Trees
				newtype = FourCC('B00P');
				break;
			default: //Trees on all other terrain types will be GREEN
				newtype = FourCC('B00M');
				break;
		}

		return newtype;
	}

	private newBarrensCanopyTree(terrainTypeId: number) {
		let newtype: number;

		switch (terrainTypeId) {
			case FourCC('Cdrd'): //Felwood - Rought Dirt = Blue Trees
				newtype = FourCC('B00H');
				break;
			case FourCC('Agrs'): //Ashenvale - Grass = Light Green Trees
				newtype = FourCC('B00F');
				break;
			case FourCC('Ndrd'): //Northrend - Dark Dirt = Yellow Trees
				newtype = FourCC('B003');
				break;
			default: //Trees on all other terrain types will be GREEN
				newtype = FourCC('B00G');
				break;
		}

		return newtype;
	}

	private newAshenvaleCanopyTree(terrainTypeId: number) {
		let newtype: number;

		switch (terrainTypeId) {
			case FourCC('Cdrd'): //Felwood - Rought Dirt = Blue Trees
				newtype = FourCC('B00C');
				break;
			case FourCC('Agrs'): //Ashenvale - Grass = Light Green Trees
				newtype = FourCC('B00D');
				break;
			case FourCC('Ndrd'): //Northrend - Dark Dirt = Yellow Trees
				newtype = FourCC('B002');
				break;
			default: //Trees on all other terrain types will be GREEN
				newtype = FourCC('B00B');
				break;
		}

		return newtype;
	}
}

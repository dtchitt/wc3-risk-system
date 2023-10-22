/**
 * Responsible for creating in-game quests.
 */
export class Quests {
	/**
	 * Creates the "Credits" quest.
	 * Sets the title, description, icon, and various other properties.
	 */
	public static Credits() {
		const credits: quest = CreateQuest();
		QuestSetTitle(credits, 'Credits');

		let description: string = 'Main Dev/Code: ForLolz#11696';
		description += '\nTerrain: Nerla#1510';
		description += '\nUnits: Saran, ForLolz#11696';
		description += '\nIcons: High/Low Health Guard: Moy | High Value Guard: The Panda | Low Value Guard NemoVonFish';
		description += '\nSS Ship Model: NA, please let ForLolz know if you know the author';
		description +=
			'\nSpecial Thanks: The Risk Community, Priwin, PsycoMarauder, RodOfNod, goble-r1sk, Saran, and all the devs from before me!';

		QuestSetDescription(credits, description);
		QuestSetIconPath(credits, 'ReplaceableTexturesWorldEditUIEditor-MultipleUnits.blp');
		QuestSetRequired(credits, false);
		QuestSetDiscovered(credits, true);
		QuestSetCompleted(credits, false);
	}
}

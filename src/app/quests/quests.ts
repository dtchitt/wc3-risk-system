/**
 * Responsible for creating in-game quests.
 */
export class Quests {
	public static Create() {
		Quests.Credits();
		Quests.Tutorial();
	}

	private static Credits() {
		let description: string = 'Main Dev/Code: ForLolz#11696';
		description += '\nTerrain: Nerla#1510';
		description += '\nUnits: Saran, ForLolz#11696';
		description += '\nIcons: High/Low Health Guard: Moy | High Value Guard: The Panda | Low Value Guard NemoVonFish';
		description += '\nSS Ship Model: ??, please let ForLolz know if you know the author';
		description += '\nSpecial Thanks: The Risk Community, Priwin, PsycoMarauder, RodOfNod, goble-r1sk, Saran, and all the devs before me!';

		Quests.BuildQuest('Credits', description, 'ReplaceableTexturesWorldEditUIEditor-MultipleUnits.blp', false);
	}

	private static Tutorial() {
		let description: string = 'How to play:';
		description += '\nThe goal of the game is to conquer 135 cities and hold them until the end of the turn.';
		description += '\nTo gain income you need to control a whole country when the turn ends.';
		description += '\nIt is best to start with smaller countries to gain income quickly.';
		description += '\nTry to expand in a way that will keep your countries connected.';
		description += '\nMake sure to use your spawns, they are free units you get each turn form countries you own.';
		description += '\nChat is essential in Risk, make sure to use it and read it. Diplomacy is key.';
		description += '\nMake sure to peace other players, but also be ready to be backstabbed when your are vulnerable.';

		Quests.BuildQuest('Tutorial', description, 'ReplaceableTexturesWorldEditUIEditor-MultipleUnits.blp', true);
	}

	private static BuildQuest(title: string, description: string, icon: string, required: boolean) {
		const quest: quest = CreateQuest();
		QuestSetTitle(quest, title);
		QuestSetDescription(quest, description);
		QuestSetIconPath(quest, icon);
		QuestSetRequired(quest, required);
		QuestSetDiscovered(quest, true);
		QuestSetCompleted(quest, false);
	}
}

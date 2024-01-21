import { STARTING_INCOME } from 'src/configs/game-settings';

export class Team {
	private teamNumber: number;
	private teamMembers: player[];
	private income: number;
	private cities: number;
	private kills: number;
	private deaths: number;

	public constructor(players: player[]) {
		this.teamNumber = GetPlayerTeam(players[0]) + 1;
		this.teamMembers = [];

		players.forEach((player) => {
			this.teamMembers.push(player);
		});

		this.income = players.length * STARTING_INCOME;
		this.cities = 0;
		this.kills = 0;
		this.deaths = 0;
	}

	public getNumber() {
		return this.teamNumber;
	}

	public getMembers() {
		return this.teamMembers;
	}

	public updateIncome(delta: number) {
		this.income += delta;
	}

	public updateCityCount(delta: number) {
		this.cities += delta;
	}

	public updateKillCount(delta: number) {
		this.kills += delta;
	}

	public updateDeathCount(delta: number) {
		this.deaths += delta;
	}

	public getIncome() {
		return this.income;
	}

	public getCities() {
		return this.cities;
	}

	public getKills() {
		return this.kills;
	}

	public getDeaths() {
		return this.deaths;
	}
}

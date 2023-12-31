import { UnitToCity } from 'src/app/city/city-map';
import { LandCity } from 'src/app/city/land-city';
import { PortCity } from 'src/app/city/port-city';
import { SelfKillHandler } from './self-kill-handler';
import { InvalidGuardHandler } from './invalid-guard-handler';
import { AlliedKillHandler } from './allied-kill-handler';
import { EnemyKillHandler } from './enemy-kill-handler';

//Where should I handle ships?
//Need to check if killer is ship and city is port or land city

//Step 1. Handle owned/allied guard killers - check in large radius for either
//Step 2. Handle enemy killer
//Step 2a. Check if there is owned/allied valid units in small radius
//Step 2b. if 2a is false, find valid enemy unit of guard in large radius
//Step 3. Handle null guardchoice - this happens when no valid replacements are found
//Step 3a. if tower is killer, do not change owner, create dummy for owner
//Step 3b. if killer is owned/allied but dead, create dummy for owner
//Step 3c. if killer is enemy but dead, create dummy for killer and change owner
export function HandleGuardDeath(dyingUnit: unit, killingUnit: unit) {
	const city: LandCity | PortCity = UnitToCity.get(dyingUnit);

	if (!city) return;

	//Check if killing unit is owned
	let guardChoice: boolean = SelfKillHandler(city, dyingUnit, killingUnit);

	//Check if killing unit is ally
	if (!guardChoice) guardChoice = AlliedKillHandler(city, dyingUnit, killingUnit);

	//Check if killing unit is enemy
	if (!guardChoice) guardChoice = EnemyKillHandler(city, dyingUnit, killingUnit);

	//Handle cases where no valid guard is found
	if (!guardChoice) {
		InvalidGuardHandler(dyingUnit, killingUnit);
	}
}

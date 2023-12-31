import { City } from 'src/app/city/city';
import { UnitToCity } from 'src/app/city/city-map';
import { CompareUnitByValue } from 'src/app/utils/unit-comparisons';

export function ReplaceGuard(city: City, searchGroup: group) {
	let guardChoice = GroupPickRandomUnit(searchGroup);

	//Make sure to grab best choice guard according to player options
	ForGroup(searchGroup, () => {
		guardChoice = CompareUnitByValue(GetEnumUnit(), guardChoice);
	});

	DestroyGroup(searchGroup);

	if (IsUnitEnemy(guardChoice, city.getOwner())) {
		city.changeOwner(GetOwningPlayer(guardChoice));
	}

	UnitToCity.delete(city.guard.unit);
	city.guard.replace(guardChoice);
	UnitToCity.set(guardChoice, city);
}

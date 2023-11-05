import { RegionSettings } from 'src/app/region/regions';

export function SetRegions() {
	RegionSettings.push({
		countryNames: ['England', 'Scotland', 'Ireland', 'Wales'],
		goldBonus: 2,
	});
}

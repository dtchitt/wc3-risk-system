import { StringToCountry } from 'src/app/country/country-map';

export function resetCountries(): Promise<void> {
	return new Promise((resolve) => {
		StringToCountry.forEach((country) => {
			country.reset();
		});
		resolve();
	});
}

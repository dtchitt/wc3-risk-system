import { City } from '../city/city';
import { Country } from './country';

/**
 * CityToCountry is a map that associates City objects with their respective Country objects.
 */
export const CityToCountry: Map<City, Country> = new Map<City, Country>();

/**
 * StringToCountry is a map that associates the name of a country (as a string) with its respective Country object.
 */
export const StringToCountry: Map<string, Country> = new Map<string, Country>();

import { assertEquals, assertExists } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { Parking } from '../src/parking.ts';
import { LngLat } from 'npm:@maptiler/sdk';
import { normalizeLyonParking } from '../src/parkingNormalizationUtils/normalizeLyonParking.ts';
import { normalizeParisParking } from '../src/parkingNormalizationUtils/normalizeParisParking.ts';
import { normalizeTflParking } from '../src/parkingNormalizationUtils/normalizeTflParking.ts';

//Données de test
const mockLyonData = [
  {
    properties: {
      gid: 1,
      type_ouvrage: 'ouvrage',
      nom: 'Test Lyon',
      nb_places: 100,
      places_disponibles: 50,
      tarif_1h: 2.5,
      nb_pmr: 5,
      nb_voitures_electriques: 10,
      etat: 'ouvert'
    },
    geometry: {
      coordinates: [4.835, 45.764]
    }
  }
];

const mockParisData = [
  {
    id: 'p1',
    type_ouvrage: 'ouvrage',
    nom: 'Test Paris',
    nb_places: 200,
    tarif_1h: 3.0,
    nb_pmr: 10,
    nb_voitures_electriques: 20,
    geo_point_2d: { lat: 48.856, lon: 2.352 }
  }
];

const mockTflData = [
  {
    id: 't1',
    placeType: 'CarPark',
    commonName: 'Test London',
    lat: 51.5074,
    lon: -0.1278,
    additionalProperties: [
      { key: 'NumberOfSpaces', value: '150' },
      { key: 'StandardTariffsCashlessDaily', value: '15.00' }
    ]
  }
];

//Tests de normalisation
Deno.test('normalizeLyonParking retourne un tableau normalisé', () => {
  const result = normalizeLyonParking(mockLyonData);
  assertEquals(Array.isArray(result), true);
  assertEquals(result.length > 0, true);
});

Deno.test('normalizeParisParking retourne un tableau normalisé', () => {
  const result = normalizeParisParking(mockParisData);
  assertEquals(Array.isArray(result), true);
});

Deno.test('normalizeTflParking retourne un tableau normalisé', () => {
  const result = normalizeTflParking(mockTflData);
  assertEquals(Array.isArray(result), true);
});

//Tests de la classe Parking
Deno.test('getNearParkings retourne des parkings proches', () => {
  const parking = new Parking();
  parking.parkingsDsp = [
    {
      id: '1',
      lib: 'Parking A',
      coordinates: { longitude: 2.3, lattitude: 48.8 },
      place_dispo: 10,
      place_tot: 50
    }
  ];
  
  const position = new LngLat(2.3, 48.8);
  const result = parking.getNearParkings(position, true, 5000);
  assertEquals(Array.isArray(result), true);
});

Deno.test('getNearestParking retourne le parking le plus proche', () => {
  const parking = new Parking();
  parking.parkingsDsp = [
    {
      id: '1',
      lib: 'Parking A',
      coordinates: { longitude: 2.3, lattitude: 48.8 },
      place_dispo: 10,
      place_tot: 50
    }
  ];
  
  const position = new LngLat(2.3, 48.8);
  const result = parking.getNearestParking(position);
  assertExists(result);
});
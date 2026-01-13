import { LngLat } from "@maptiler/sdk";
import { normalizeLyonParking } from "./parkingNormalizationUtils/normalizeLyonParking";
import { normalizeParisParking} from "./parkingNormalizationUtils/normalizeParisParking"
import { normalizeTflParking } from "./parkingNormalizationUtils/normalizeTflParking";
import { normalizeMetzParking } from "./parkingNormalizationUtils/normalizeMetzParking";
const apiLyon = import.meta.env.VITE_LYON_KEY;
const apiMetz = import.meta.env.VITE_METZ_KEY;
const apiParis = import.meta.env.VITE_PARIS_KEY;
const apiTfl = import.meta.env.VITE_TFL_KEY;
export class Parking {
    parkingsDsp : any[] = [];
    parkings : any[] = [];
// prefence : [0] gratuit seulement , [1] pmr seulement, [2] borne de recharge seulement
    getParkingPreference(parkings : any[], position: LngLat, preference: number[]){
        if(preference[0] === 1){
            parkings = parkings.filter(parking => {
                return parking.payant === false;
            });
        }
        if(preference[1] === 1){
            parkings = parkings.filter(parking => {
                return parking.pmr && parking.pmr > 0;
            });
        }
        if(preference[2] === 1){
            parkings = parkings.filter(parking => {
                return parking.borne_recharge && parking.borne_recharge > 0;
            }); 
        }       
        return parkings;
    }
    getNearParkings(position: LngLat, dspOnly: boolean, radius: number = 3000, preference : number[] = [0,0,0]) {
        let nearbyParkings = [];
        
        const dspParkings = this.parkingsDsp.filter(parking => {
            const parkingPos = new LngLat(parking.coordinates.longitude, parking.coordinates.lattitude);
            const distance = position.distanceTo(parkingPos);
            return distance <= radius;
        });
        nearbyParkings.push(...dspParkings);

        if (!dspOnly) {
            const otherParkings = this.parkings.filter(parking => {
                const parkingPos = new LngLat(parking.coordinates.longitude, parking.coordinates.lattitude);
                const distance = position.distanceTo(parkingPos);
                return distance <= radius;
            });
            nearbyParkings.push(...otherParkings);
        }
        nearbyParkings = this.getParkingPreference(nearbyParkings, position, preference);
        return nearbyParkings;
    }

    getNearestParking(position: LngLat) {
        let nearestParking = null;
        let minDistance = Infinity;

        const allParkings = [...this.parkingsDsp, ...this.parkings]; 

        for (let parking of allParkings) {
            const parkingPos = new LngLat(parking.coordinates.longitude, parking.coordinates.lattitude);
            const distance = position.distanceTo(parkingPos);
            if (distance < minDistance) {
                minDistance = distance;
                nearestParking = parking;
            }
        }
        return nearestParking;
    }
    // metz seulement + sert de base pour les autres villes
    async fetchParkings() {
        this.parkings = [];
        this.parkingsDsp = [];
        try {
        const metzResponse = await fetch(apiMetz);
        if (metzResponse.ok) {
            const metzData = await metzResponse.json();
            if (metzData.features) {
                const normalizedMetz = normalizeMetzParking(metzData.features);
                this.parkingsDsp.push(...normalizedMetz);
            }
            }
        } catch (e) {
            console.error('Failed to fetch Metz parkings: ', e);
        }

        try {
            const tflUrl = apiTfl;
            const tflResponse = await fetch(tflUrl);

            if(!tflResponse.ok){
                console.error(`TFL Location API request failed with status ${tflResponse.status}`);
            }
            else { 
                const tflData = await tflResponse.json();
                const normalizedTflParkings = normalizeTflParking(tflData);
                // On les mettra dans parkingsDsp tant que l'API Occupancy ne fonctionne pas
                this.parkingsDsp.push(...normalizedTflParkings) // décomposer et fusionner  (https://www.geeksforgeeks.org/typescript/how-to-use-spread-operator-in-typescript/)
            }
        } catch(e){
            console.error('Failed to fetch TFL parkings: ', e);
        }
        try {
            const parisUrl = apiParis;
            const parisResponse = await fetch(parisUrl);
            
            if(!parisResponse.ok) {
                console.error(`Paris OpenData API request failed with status ${parisResponse.status}`);
            } else {
                const parisDataJson = await parisResponse.json();
                if(parisDataJson.results) {
                    const normalizedParisParkings = normalizeParisParking(parisDataJson.results);
                    // Ne donne pas le nombre de place dispo donc on mets de base
                    this.parkingsDsp.push(...normalizedParisParkings);
                }
            }
        } catch(e) {
            console.error('Failed to fetch Paris parkings: ', e);
        }
        try {
            const lyonUrl = apiLyon;
            
            const lyonResponse = await fetch(lyonUrl);
            
            if(!lyonResponse.ok) {
                console.error(`Lyon OpenData API request failed with status ${lyonResponse.status}`);
            } else {
                const lyonDataJson = await lyonResponse.json();
                if(lyonDataJson.features) {
                    const normalizedLyonParkings = normalizeLyonParking(lyonDataJson.features);
                    this.parkingsDsp.push(...normalizedLyonParkings);
                }
            }
        } catch(e) {
            console.error('Failed to fetch Lyon parkings: ', e);
        }
    }
}
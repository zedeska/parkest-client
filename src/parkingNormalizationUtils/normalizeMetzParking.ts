export function normalizeMetzParking(metzData: any[]) {
    return metzData.map(feature => {
        const props = feature.properties;
        const geom = feature.geometry;
        
        return {
            id: feature.id,
            type: props.typ === 'parking-relais' ? 'P+R' : 'Parking Public',
            lib: props.lib || "Parking Metz",
            place_tot: props.place_total || 0,
            place_dispo: props.place_libre || null,
            payant: props.cout === 'payant' ? true : false,
            pmr: 0,
            borne_recharge: 0,
            cout: props.cout === 'null' ? 'Gratuit' : 'Payant',
            coordinates: {
                lattitude: geom.coordinates[1],
                longitude: geom.coordinates[0]
            },
            city: 'Metz'
        };
    });
}
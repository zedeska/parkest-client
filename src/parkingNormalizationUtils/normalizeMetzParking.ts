export function normalizeMetzParking(metzData: any[]) {
    const normalized = [];
    for (const feature of metzData) {
        const props = feature.properties;
        const geom = feature.geometry;

        if (geom && geom.coordinates) {
            normalized.push({
                id: feature.id || props.fid,
                type: props.id?.includes("PMR") ? "Place PMR" : "Stationnement Voirie",
                lib: `${props.nombre} place(s) - ${props.voie}`,
                place_tot: props.nombre || 1,
                place_dispo: null,
                payant: props.domaine === "PUBLIC" ? false : true,
                cout: props.domaine === "PUBLIC" ? "Gratuit" : "Privé/Payant",
                pmr: props.id?.includes("PMR") ? props.nombre : 0,
                borne_recharge: 0,
                coordinates: {
                    lattitude: geom.coordinates[1],
                    longitude: geom.coordinates[0]
                },
                city: 'Metz',
                quartier: props.quartier,
                complement: props.comp_loc
            });
        }
    }
    return normalized;
}
import { writable } from 'svelte/store';  
import User from '../user';

const user : User = new User(136, false, false, false, false);
const stored = localStorage.getItem('user');

if (stored) {
    const parsed = JSON.parse(stored);
    Object.assign(user, parsed);
}

const UserContent = writable(user);

UserContent.subscribe(async (value) => {
    localStorage.setItem('user', JSON.stringify(value));
    if (value.token && value.token !== "") {
        try {
            await fetch('https://parking-api-ymux.onrender.com/api/updateParams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: value.token,
                    params: {
                        hauteur: value.hauteur,
                        pmr: value.pmr,
                        free: value.free,
                        elec: value.elec,
                        dspOnly: value.dspOnly
                    }
                })
            });
        } catch (e) {
            console.error("Erreur de synchro MongoDB", e);
        }
    }
});

export { UserContent };

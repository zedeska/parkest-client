import { Login, Register } from "./api";

class User {
    hauteur: number;
    pmr: boolean;
    dspOnly: boolean;
    elec: boolean;
    free: boolean;
    username: string = "";
    token: string = "";
    
    constructor(hauteur: number, pmr: boolean, elec: boolean, free: boolean, dspOnly: boolean) {
        this.hauteur = hauteur;
        this.pmr = pmr;
        this.elec = elec;
        this.free = free;
        this.dspOnly = dspOnly;
    }

    async login(username: string, password: string): Promise<void> {
    const data = await Login(username, password);
    this.token = data.token;
    this.username = username;
    if (data.params) {
        this.hauteur = data.params.hauteur;
        this.pmr = data.params.pmr;
        this.free = data.params.free;
        this.elec = data.params.elec;
        this.dspOnly = data.params.dspOnly;
    }
}

    async register(username: string, password: string): Promise<void> {
        try {
            const data = await Register(username, password);
            this.token = data.token || data;
            this.username = username;
        } catch (error) {
            throw error;
        }
    }
}

export default User;

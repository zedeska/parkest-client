import { GetParams, Login, Register, UpdateParams } from "./api";

export class User {
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

    async login(username: string, password: string): Promise<void>{
        try {
            this.token = (await Login(username, password)).token;
            this.username = username;
        } catch (error) {
            throw error;
        }
    }
}

    async register(username: string, password: string): Promise<void> {
        try {
            const data = await Register(username, password);
            this.token = data.token;
            this.username = username;
        } catch (error) {
            throw error;
        }
    }

    async updateParams(): Promise<void>{
        try {
            await UpdateParams(this.token, this.hauteur, this.pmr, this.dspOnly, this.elec, this.free);
        } catch (error) {
            throw error;
        }
    }

    async fetchParams(): Promise<void>{
        try {
            const data = await GetParams(this.token);
            this.hauteur = data.hauteur;
            this.pmr = data.pmr;
            this.dspOnly = data.dspOnly;
            this.elec = data.elec;
            this.free = data.free;
            console.log("fetched params", data);
        } catch (error) {
            throw error;
        }
    }
}

export default User;

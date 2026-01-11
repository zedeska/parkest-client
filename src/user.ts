import { Login, Register } from "./api";

class User{

    hauteur: number;
    pmr: boolean;
    dspOnly: boolean;
    username: string = "";
    token:  string = "";
    
    constructor(hauteur: number, pmr: boolean, dspOnly: boolean){
        this.hauteur = hauteur;
        this.pmr = pmr;
        this.dspOnly = dspOnly;
    }

    async login(username: string, password: string): Promise<void>{
        try {
            this.token = await Login(username, password);
            this.username = username;
        } catch (error) {
            throw error;
        }
    }

    async register(username: string, password: string): Promise<void>{
        try {
            this.token = await Register(username, password);
            this.username = username;
        } catch (error) {
            throw error;
        }
    }
}

export default User;
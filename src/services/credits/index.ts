import api from "@/lib/api"
import { AxiosResponse } from "axios";

export default class CreditsService {
    private credits: number

    private constructor(credits: number) {
        this.credits =  credits;
    }

    static async init() {
        const credits = await this.fetchCredits();
        return new CreditsService(credits)
    }

    public get() {
        return this.credits
    }

    static async fetchCredits() {
        const creditsResponse: AxiosResponse<{ credits: number }> = await api.get('/api/credits/balance');
        return creditsResponse.data.credits;
    }
}
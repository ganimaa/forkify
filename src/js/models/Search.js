
import axios from 'axios';
import {proxy, appId, appKey, API} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        
        const to = '30';

        try {
            const res = await axios(`${proxy}${API}/search?app_id=${appId}&app_key=${appKey}&q=${this.query}&to=${to}`);
            this.result = res.data.hits;
        } catch(err) {
            console.log(err);
        }
    }
};

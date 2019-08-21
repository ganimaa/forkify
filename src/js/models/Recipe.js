import axios from 'axios';
import {proxy, appId, appKey, API} from '../config';

export default class Recipe {
    constructor(uri) {
        this.uri = uri;
    }

    async getRecipe() {
        try {
            const res = await axios(`${proxy}${API}/search?app_id=${appId}&app_key=${appKey}&r=${encodeURIComponent(this.uri)}`);
            const result = res.data[0];
            this.title = result.label;
            this.author = result.source;
            this.img = result.image;
            this.url = result.url;
            this.ingredients = result.ingredientLines;
        } catch (err) {
            console.log('Something went wrong in Recipe :)');
            console.log(err);
        }
    };

    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    };

    calcServings() {
        this.servings = 4;
    };

    parseIngredients() {
        const units = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound', 'x', 'g'];
        const newIngredients = this.ingredients.map(el => {
            let ingredient = el.toLowerCase();
            ingredient = ingredient.replace(/ *\([^)]*\) */g, "");

            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
            let objIng;
            if (unitIndex > -1) {
                let arrCount = arrIng.slice(0, unitIndex);
                let minusSignIndex = arrCount.findIndex(el3 => el3 === '-');
                let count;

                if (minusSignIndex > -1) {
                    arrCount[minusSignIndex] = '+';
                    count = eval(arrCount.join(''));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                count = (Math.round(count * 100) / 100).toString();

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (unitIndex === -1) {
                objIng = {
                    count:'',
                    unit: '',
                    ingredient
                }
            } else if (parseInt(arrIng[0], 10)) {
                objIng = {
                    count: parseInt(arrIng[0], 10).toString(),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    };

    updateServings(type) {
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        this.ingredients.forEach(element => {
            element.count *= newServings / this.servings;
        });
        this.servings = newServings;
    }

}

import { elements, renderLoader, clearLoader } from './views/base';
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

const state = {};

const controlSearch = async () => {

    const query = searchView.getInput();
    console.log(query);

    if (query) {
        state.search = new Search(query)
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            await state.search.getResults();
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(err) {
            console.log('Something wrong with the search :)');
            console.log(err);
        }
    }
};

const controlRecipe = async () => {
    const uri = window.location.hash.replace('#', '');

    if (uri) {
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        if (state.search) searchView.highlightSelected(uri);

        state.recipe = new Recipe(uri);
        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            state.recipe.calcTime();
            state.recipe.calcServings();
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(uri));
        } catch(err) {
            console.log(err);
        }
    }

    
};

const controlList = () => {
    if (!state.list) state.list = new List();
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};


// TESTING
state.likes = new Likes();

const controlLike = () => {
    // if (!state.likes) state.likes = new Likes();
    const currentUri = state.recipe.uri;
    if (!state.likes.isLiked(currentUri)) {
        const newLike = state.likes.addLike(currentUri, state.recipe.title, state.recipe.author, state.recipe.img);
        likesView.toggleLikeBtn(true);
        likesView.renderLike(newLike);
    } else {
        state.likes.deleteLike(currentUri);
        likesView.toggleLikeBtn(false);
        likesView.deleteLike(currentUri);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};



elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const gotoPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, gotoPage);
    }
});


window.addEventListener('load', controlRecipe);
window.addEventListener('hashchange', controlRecipe);

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseInt(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

// Recipe button handling
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        listView.clearList();
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
});
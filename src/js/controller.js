import * as model from './model.js';
import recipeView from './views/recipieView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipieView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

///////////////////////////////////////

const controlRecipies = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    //0) update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //3)updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //1>loading recipie
    await model.loadRecipe(id);

    //2> rendering recipies
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1) Get search query
    const query = searchView.getQuery();

    //2) Load search results
    await model.loadSearchResults(query);

    //3) render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //4) Render initial paginaion buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1) render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2) Render new initial paginaion buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipie servings (in state)
  model.updateServings(newServings);
  //update recipie view
  //
  recipeView.update(model.state.recipe);
};

const controlAddBoomkark = function () {
  //1) Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2)Update recipie view
  recipeView.update(model.state.recipe);

  //3)render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipie = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipie(newRecipe);
    // console.log(model.state.recipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 2500);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('Welcome updated');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipies);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBoomkark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addhandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipie);

  newFeature();
};
init();

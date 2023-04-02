const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
});

/////// utlis

function createMovies(movies, container) {
  container.innerHTML = "";

  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    movieContainer.addEventListener("click", () => {
      location.hash = "#movie=" + movie.id;
    });

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
      "src",
      "https://image.tmdb.org/t/p/w300/" + movie.poster_path
    );
    movieContainer.appendChild(movieImg);
    container.appendChild(movieContainer);
  });
}

function createCategories(categories, container) {
  container.innerHTML = "";

  categories.forEach((category) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");

    const categotyTitle = document.createElement("h3");
    categotyTitle.classList.add("category-title");
    categotyTitle.setAttribute("id", "id" + category.id);
    categotyTitle.addEventListener("click", () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    const categoryTitleText = document.createTextNode(category.name);

    categotyTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categotyTitle);
    categoriesPreviewList.appendChild(categoryContainer);
  });
}

//// call to API

async function getTrendingMoviesPreview() {
  const { data } = await api("trending/movie/day");

  const movies = data.results;
  console.log({ data, movies });

  createMovies(movies, trendingMoviesPreviewList);
}

async function getCategoriesPreview() {
  const { data } = await api("genre/movie/list");

  const categories = data.genres;

  createCategories(categories, categoriesPreviewList);
}

async function getMoviesByCategory(id) {
  const { data } = await api("discover/movie", {
    params: {
      with_genres: id,
    },
  });

  const movies = data.results;
  console.log({ data, movies });

  createMovies(movies, genericSection);
}

async function getMoviesBySearch(query) {
  const { data } = await api("search/movie", {
    params: {
      query,
    },
  });

  const movies = data.results;
  console.log({ data, movies });

  createMovies(movies, genericSection);
}

async function getTrendingMovies() {
  const { data } = await api("trending/movie/day");

  const movies = data.results;
  console.log({ data, movies });

  createMovies(movies, genericSection);
}

async function getMovieById(id) {
  const { data: movie } = await api("movie/" + id);

  const movieImgUrl = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
  headerSection.style.background = `
  linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.35) 19.27%,
    rgba(0, 0, 0, 0) 29.17%
  ),
  url(${movieImgUrl})`;
  console.log(movieImgUrl);

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  createCategories(movie.genres, movieDetailCategoriesList);
  console.log(movieDetailCategoriesList);

  getRelateMoviesId(id);
}

async function getRelateMoviesId(id) {
  const { data } = await api(`movie/${id}/recommendations`);
  const relateMovies = data.results;

  createMovies(relateMovies, relatedMoviesContainer);
}

// Global state
const state = {
    recipes: [],
    currentPage: 1,
    totalPages: 1,
    limit: 15,
    sortField: 'rating',
    sortOrder: 'desc',
    filters: {
        title: '',
        cuisine: '',
        rating: '',
        total_time: '',
        calories: ''
    },
    isLoading: false,
    isDetailOpen: false,
    currentRecipe: null
};

// API base URL - update this to match your API server
const API_BASE_URL = "http://127.0.0.1:8000";

// DOM elements
const elements = {
    recipesTable: document.getElementById('recipes-table'),
    recipesBody: document.getElementById('recipes-body'),
    loadingIndicator: document.getElementById('loading-indicator'),
    emptyState: document.getElementById('empty-state'),
    errorState: document.getElementById('error-state'),
    prevPageBtn: document.getElementById('prev-page'),
    nextPageBtn: document.getElementById('next-page'),
    currentPageSpan: document.getElementById('current-page'),
    totalPagesSpan: document.getElementById('total-pages'),
    limitSelect: document.getElementById('limit-select'),
    sortFieldSelect: document.getElementById('sort-field'),
    sortOrderSelect: document.getElementById('sort-order'),
    titleFilter: document.getElementById('title-filter'),
    cuisineFilter: document.getElementById('cuisine-filter'),
    ratingFilter: document.getElementById('rating-filter'),
    timeFilter: document.getElementById('time-filter'),
    caloriesFilter: document.getElementById('calories-filter'),
    applyFiltersBtn: document.getElementById('apply-filters'),
    clearFiltersBtn: document.getElementById('clear-filters'),
    detailDrawer: document.getElementById('detail-drawer'),
    closeDrawerBtn: document.getElementById('close-drawer'),
    drawerTitle: document.getElementById('drawer-title'),
    drawerCuisine: document.getElementById('drawer-cuisine'),
    recipeDescription: document.getElementById('recipe-description'),
    recipeTotalTime: document.getElementById('recipe-total-time'),
    recipePrepTime: document.getElementById('recipe-prep-time'),
    recipeCookTime: document.getElementById('recipe-cook-time'),
    recipeServes: document.getElementById('recipe-serves'),
    nutritionBody: document.getElementById('nutrition-body'),
    expandTimeBtn: document.getElementById('expand-time'),
    expandedTime: document.getElementById('expanded-time')
};

// Initialize the application
function init() {
    loadRecipes();
    attachEventListeners();
}

// Fetch recipes from the API
async function loadRecipes() {
    try {
        showLoading(true);

        let url;
        const searchParams = new URLSearchParams();

        const hasActiveFilters = Object.values(state.filters).some(value => value !== '');

        if (hasActiveFilters) {
            url = `${API_BASE_URL}/api/recipes/search`;

            for (const [key, value] of Object.entries(state.filters)) {
                if (value) {
                    searchParams.append(key, value);
                }
            }
        } else {
            url = `${API_BASE_URL}/api/recipes`;

            searchParams.append('page', state.currentPage);
            searchParams.append('limit', state.limit);
            searchParams.append('sort_field', state.sortField);
            searchParams.append('sort_order', state.sortOrder);
        }

        const finalUrl = `${url}?${searchParams.toString()}`;
        console.log("Fetching from:", finalUrl);

        const response = await fetch(finalUrl, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch recipes: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API response:", data);

        if (!data.data || data.data.length === 0) {
            showEmptyState(true);
            showErrorState(false);
            state.recipes = [];
        } else {
            showEmptyState(false);
            showErrorState(false);
            state.recipes = data.data;

            if (data.page && data.total) {
                state.currentPage = data.page;
                state.totalPages = Math.ceil(data.total / state.limit);
                updatePaginationUI();
            }
        }

        renderRecipes();
    } catch (error) {
        console.error('Error loading recipes:', error);
        showErrorState(true);
        showEmptyState(false);
        state.recipes = [];
    } finally {
        showLoading(false);
    }
}

// Render recipes to the table
function renderRecipes() {
    elements.recipesBody.innerHTML = '';

    state.recipes.forEach(recipe => {
        const row = document.createElement('tr');
        row.dataset.id = recipe.id;

        row.innerHTML = `
            <td><div class="recipe-title" title="${recipe.title}">${recipe.title}</div></td>
            <td><span class="cuisine-tag">${recipe.cuisine}</span></td>
            <td>${renderStarRating(recipe.rating)}</td>
            <td>${recipe.total_time} min</td>
            <td>${recipe.serves}</td>
        `;

        row.addEventListener('click', () => openRecipeDetail(recipe));
        elements.recipesBody.appendChild(row);
    });
}

// Render star rating
function renderStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHtml = '';

    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }

    return `<div class="star-rating">${starsHtml}<span class="rating-number">${rating}</span></div>`;
}

// Open recipe detail drawer
function openRecipeDetail(recipe) {
    state.currentRecipe = recipe;
    state.isDetailOpen = true;

    elements.drawerTitle.textContent = recipe.title;
    elements.drawerCuisine.textContent = recipe.cuisine;
    elements.recipeDescription.textContent = recipe.description;
    elements.recipeTotalTime.textContent = `${recipe.total_time} minutes`;
    elements.recipePrepTime.textContent = `${recipe.prep_time} minutes`;
    elements.recipeCookTime.textContent = `${recipe.cook_time} minutes`;
    elements.recipeServes.textContent = recipe.serves;

    elements.expandedTime.classList.add('hidden');
    elements.expandTimeBtn.classList.remove('expanded');

    renderNutrition(recipe.nutrients);

    elements.detailDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
}

// Close recipe detail drawer
function closeRecipeDetail() {
    state.isDetailOpen = false;
    elements.detailDrawer.classList.remove('open');
    document.body.style.overflow = '';
}

// Render nutrition information
function renderNutrition(nutrients) {
    elements.nutritionBody.innerHTML = '';

    const nutritionItems = [
        { key: 'calories', label: 'Calories' },
        { key: 'carbohydrateContent', label: 'Carbohydrates' },
        { key: 'cholesterolContent', label: 'Cholesterol' },
        { key: 'fiberContent', label: 'Fiber' },
        { key: 'proteinContent', label: 'Protein' },
        { key: 'saturatedFatContent', label: 'Saturated Fat' },
        { key: 'sodiumContent', label: 'Sodium' },
        { key: 'sugarContent', label: 'Sugar' },
        { key: 'fatContent', label: 'Total Fat' }
    ];

    nutritionItems.forEach(item => {
        if (nutrients[item.key]) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.label}</td>
                <td>${nutrients[item.key]}</td>
            `;
            elements.nutritionBody.appendChild(row);
        }
    });
}

// Update pagination UI
function updatePaginationUI() {
    elements.currentPageSpan.textContent = state.currentPage;
    elements.totalPagesSpan.textContent = state.totalPages;

    elements.prevPageBtn.disabled = state.currentPage <= 1;
    elements.nextPageBtn.disabled = state.currentPage >= state.totalPages;
}

// Show/hide loading indicator
function showLoading(show) {
    state.isLoading = show;
    elements.loadingIndicator.style.display = show ? 'flex' : 'none';
    elements.recipesTable.style.opacity = show ? '0.5' : '1';
}

// Show/hide empty state
function showEmptyState(show) {
    elements.emptyState.classList.toggle('hidden', !show);
    elements.recipesTable.classList.toggle('hidden', show);
}

// Show/hide error state
function showErrorState(show) {
    elements.errorState.classList.toggle('hidden', !show);
    elements.recipesTable.classList.toggle('hidden', show);
}

// Apply filters
function applyFilters() {
    state.filters.title = elements.titleFilter.value.trim();
    state.filters.cuisine = elements.cuisineFilter.value.trim();
    state.filters.rating = elements.ratingFilter.value.trim();
    state.filters.total_time = elements.timeFilter.value.trim();
    state.filters.calories = elements.caloriesFilter.value.trim();

    state.currentPage = 1;
    loadRecipes();
}

// Clear filters
function clearFilters() {
    elements.titleFilter.value = '';
    elements.cuisineFilter.value = '';
    elements.ratingFilter.value = '';
    elements.timeFilter.value = '';
    elements.caloriesFilter.value = '';

    Object.keys(state.filters).forEach(key => {
        state.filters[key] = '';
    });

    state.currentPage = 1;
    loadRecipes();
}

// Pagination
function goToPrevPage() {
    if (state.currentPage > 1) {
        state.currentPage--;
        loadRecipes();
    }
}

function goToNextPage() {
    if (state.currentPage < state.totalPages) {
        state.currentPage++;
        loadRecipes();
    }
}

// Attach event listeners
function attachEventListeners() {
    elements.prevPageBtn.addEventListener('click', goToPrevPage);
    elements.nextPageBtn.addEventListener('click', goToNextPage);
    elements.applyFiltersBtn.addEventListener('click', applyFilters);
    elements.clearFiltersBtn.addEventListener('click', clearFilters);
    elements.closeDrawerBtn.addEventListener('click', closeRecipeDetail);
    elements.expandTimeBtn.addEventListener('click', () => {
        elements.expandedTime.classList.toggle('hidden');
        elements.expandTimeBtn.classList.toggle('expanded');
    });
    elements.limitSelect.addEventListener('change', (e) => {
        state.limit = parseInt(e.target.value);
        state.currentPage = 1;
        loadRecipes();
    });
    elements.sortFieldSelect.addEventListener('change', (e) => {
        state.sortField = e.target.value;
        loadRecipes();
    });
    elements.sortOrderSelect.addEventListener('change', (e) => {
        state.sortOrder = e.target.value;
        loadRecipes();
    });
}

// Start the app
init();
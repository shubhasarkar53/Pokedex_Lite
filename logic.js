console.log("hi");
// Select the necessary DOM elements
const typesDropDown = document.querySelector("#pokemon-types");
const pokemonContainer = document.querySelector("#pokemon-container");
const submitBtn = document.querySelector("#submit-btn");
const loader = document.querySelector('#loader');

// Function to show the loader
function showLoader() {
    loader.style.display = 'block';
}

// Function to hide the loader
function hideLoader() {
    loader.style.display = 'none';
}

// Function for fetching all the type/categories possible Pokemons
async function fetchTypesAndRender() {
    try {
        const res = await fetch("https://pokeapi.co/api/v2/type");
        const data = await res.json();
        const types = data.results;
        types.forEach((type) => {
            const option = document.createElement("option");
            option.value = type.name;
            option.innerText = type.name.toUpperCase();
            typesDropDown.appendChild(option);
        });
    } catch (error) {
        console.log(error);
    }
}

// Get all the Pokemon names in the category
async function getPokemonNamesByType(type, pokemonCount) {
    try {
        const resp = await fetch(`https://pokeapi.co/api/v2/type/${type}/`);
        const res = await resp.json();
        const data = res.pokemon;

        let filteredPokemonNames = data.map((poke) => poke.pokemon.name);
        let filteredPokemons = [];

        for (let index = 0; index < pokemonCount; index++) {
            filteredPokemons.push(filteredPokemonNames[index]);
        }

        // Pass the pokemon array to the showPokemonCards func
        showPokemonCards(filteredPokemons);
    } catch (error) {
        console.log(error);
        hideLoader();  // Hide loader in case of error
    }
}

// Function to show the card
async function showPokemonCards(pokemonsArr) {
    try {
        for (const pokemon of pokemonsArr) {
            await fetchPokemonDetails(pokemon);
        }
        hideLoader();  // Hide the loader after all pokemons are fetched and rendered
    } catch (error) {
        console.log(error);
        hideLoader();  // Hide loader in case of error
    }
}

// Helper function to get the specific pokemon's details
async function fetchPokemonDetails(pokemon) {
    try {
        const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        const res = await resp.json();
        renderPokemon(res);
    } catch (error) {
        console.log(error);
        hideLoader();  // Hide loader in case of error
    }
}

// Helper function to display the card on the UI
function renderPokemon(pokemonDetails) {
    console.log(pokemonDetails);
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    const img = document.createElement("img");
    img.src = pokemonDetails.sprites.front_default;
    card.appendChild(img);

    const name = document.createElement("div");
    name.classList.add("pokemon-name");
    name.textContent =
        pokemonDetails.name.charAt(0).toUpperCase() + pokemonDetails.name.slice(1);
    card.appendChild(name);

    const type = document.createElement("div");
    type.classList.add("pokemon-type");
    type.textContent = pokemonDetails.types
        .map((t) => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1))
        .join(", ");
    card.appendChild(type);

    pokemonContainer.appendChild(card);
}

// Function to handle the submit button functionality
function handleSubmit(e) {
    e.preventDefault();
    pokemonContainer.innerHTML = "";  // Clear previous Pokemon cards
    const pokemonType = document.querySelector("#pokemon-types").value;
    const pokemonCount = document.querySelector("#pokemon-count").value;
    showLoader();  // Show loader when fetching starts
    getPokemonNamesByType(pokemonType, pokemonCount);
}

// Add listener to the submit function
submitBtn.addEventListener("click", handleSubmit);

// Fetch all the categories of Pokemon initially
fetchTypesAndRender();

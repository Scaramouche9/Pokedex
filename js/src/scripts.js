// IIFE function to avoid accidentally accessing the global state
let pokemonRepository = (function () {

  // empty array of pokemon, obtained from pokemon api
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  // returns all values in the pokemon array via forEach loop
  function getAll() {
    return pokemonList;
  }

  // ensures pokemon is an object
  function add(pokemon) {
    if (typeof pokemon === 'object') {
      return pokemonList.push(pokemon);
    } else {
      console.log('not a pokemon')
    }
  }

  // adds a new pokemon
  function addListItem(pokemon) {
  
    // creates <ul>
    let list = document.querySelector('.pokemon-list', '.list-group');
      
    // creates <li>
    let listItem = document.createElement('li');

    // creates container to set up grid using <div>
    let container = document.createElement('div');

    // creates <button>
    let button = document.createElement('button', 'btn', 'btn-primary');

    // adds class to list item
    listItem.classList.add('list-item', 'group-list-item');

    // adds class to container div
    container.classList.add('pokemon');
  
    // adds class to button
    button.classList.add('pokemon-button', 'btn', 'btn-primary');

    // adds text to button
    button.innerText = pokemon.name;

    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#exampleModal');
    button.classList.add(pokemon.name);

    // establishes hierarchy of list elements
    container.appendChild(button);
    listItem.appendChild(container);
    list.appendChild(listItem);

    // activates showDetails upon clicking button
    button.addEventListener('click', function () {
      showDetails(pokemon);
    });
  }

  // obtains data from pokemon api
  function loadList() {
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    });
  }

  // add details to array from api data
  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      item.name = details.name;
      item.imgUrl = details.sprites.front_default;
      item.height = details.height;
      item.weight = details.weight;
      item.types = details.types;
    }).catch(function (e) {
      console.error(e);
    })
  }

  // outputs requested details from api for specific pokemon
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {  
      showModal(pokemon);
    }) 
  }

// MODAL

  // shows modal only if button is clicked
  function showModal(pokemon) {

    // clears all existing modal content
    let modalBody = $('.modal-body');
    let modalTitle = $('.modal-title');

    modalBody.empty();
    modalTitle.empty();

    // adds name as heading in modal
    let nameElement = $('<h5>' + 'Hi, I\'m ' + pokemon.name + '!' + '</h5>');

    // adds pokemon image to modal
    let imageElement = $(`<img class='modal-image' style='width:30%' alt='image of ${pokemon.name}'>`);
    imageElement.attr('src', pokemon.imgUrl);

    // adds pokemon height to modal
    let heightElement = $('<p>' + 'Height: ' + pokemon.height + ' m' + '</p>');

    // adds pokemon weight to modal
    let weightElement = $('<p>' + 'Weight: ' + pokemon.weight + ' kg' + '</p>');

    // adds pokemon type(s) to modal
    let typesElement = $(`<p> Types(s): ${pokemon.types.map(p => p.type.name).join(', ')}</p>`);

    // establishes hierachy of modal elements
    modalTitle.append(nameElement);
    modalBody.append(imageElement);
    modalBody.append(heightElement);
    modalBody.append(weightElement);
    modalBody.append(typesElement);
  } 

  // functions that can access the IIFE
  return {
    add: add,
    getAll: getAll,
    loadList: loadList,
    loadDetails: loadDetails,
    addListItem: addListItem,
    showDetails: showDetails,
    showModal: showModal,
  };
}) ();

// loop used to list all Pokemon on webpage

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon)
  });
});

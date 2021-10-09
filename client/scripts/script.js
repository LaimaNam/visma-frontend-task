// --  Variables
//DOM elements

// --form
const form = document.querySelector('#add-pizza-form');
const pizzaName = document.querySelector('#name');
const pizzaPrice = document.querySelector('#price');
const pizzaHeat = document.querySelector('#heat');
const pizzaToppings = document.querySelector('#toppings');
const pizzaPhotoSelect = document.querySelector('#pizzaPhoto');

// -- menu
const menuOutput = document.querySelector('.menu-output');

// -- filter
const menufilter = document.querySelector('#filterMenu');

// -- FUNCTIONS

// -- -- SessionStorage

//get items from storage
const getItemsFromSessionStorage = () => {
  return JSON.parse(sessionStorage.getItem('menuItems'));
};

//update items in session storage
const updateItemsOnSessionStorage = (arr) => {
  sessionStorage.setItem('menuItems', JSON.stringify(arr));
};

// -- logic helpers
const itemsFromStorage = getItemsFromSessionStorage();

//pepper icon renderer
const pizzaHeatIconRenderer = (number) => {
  let heat = '';
  for (let i = 0; i < number; i++) {
    heat +=
      '<img src="./assets/icons/chili-pepper.png" alt="" class="heat-item">';
  }
  return heat;
};

//pizza photo rendere
const pizzaPhotoRender = (photo) => {
  if (photo === 'pizza1') {
    return './assets/pizzaPhotos/pizzaPhoto1.jpg';
  } else if (photo === 'pizza2') {
    return './assets/pizzaPhotos/pizzaPhoto2.jpg';
  } else if (photo === 'pizza3') {
    return './assets/pizzaPhotos/pizzaPhoto3.jpg';
  } else if (photo === 'pizza4') {
    return './assets/pizzaPhotos/pizzaPhoto4.jpg';
  }
};

//menu rederer
const renderMenu = (pizzaArray) => {
  menuOutput.innerHTML = pizzaArray.reduce((total, pizza) => {
    total += `
    <div class="menu-item" >
      <button class="delete-item" data-id=${pizza.name}>&#128465</button>
      <img src="${pizzaPhotoRender(
        pizza.photo
      )}" alt="" class="menu-item__photo" />
      <div class="pizza-heat">${pizzaHeatIconRenderer(+pizza.heat)}</div>
      <h5>${pizza.name}</h5>
      <span>${pizza.price}</span>
      <span>${pizza.toppings}</span>
    </div>
      `;

    return total;
  }, '');

  // delete button event
  const deleteBtns = document.querySelectorAll('.delete-item');
  deleteBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      deleteItemFromSessionStorage(e.target.dataset.id);
    });
  });
};

//save item to session storage
const saveItemToSessionStorage = (e) => {
  e.preventDefault();

  let pizzaArr = [];

  if (itemsFromStorage) {
    pizzaArr = itemsFromStorage;
  }

  const pizzaItem = {
    name: pizzaName.value,
    price: pizzaPrice.value,
    heat: pizzaHeat.value,
    toppings: pizzaToppings.value,
    photo: pizzaPhotoSelect.value,
  };

  // adding pizza to the session storage
  pizzaArr.push(pizzaItem);

  updateItemsOnSessionStorage(pizzaArr);

  // resetting the form
  form.reset();
};

//delete item from session storage
const deleteItemFromSessionStorage = (id) => {
  let indexOfPizzaToRemove;

  if (window.confirm('Do you really want to delete this item?')) {
    // -- getting index of pizza to delete
    itemsFromStorage.forEach((item, index) => {
      if (item.name === id) {
        indexOfPizzaToRemove = index;
      }
    });

    itemsFromStorage.splice(indexOfPizzaToRemove, 1);

    //update
    updateItemsOnSessionStorage(itemsFromStorage);
    renderMenu(itemsFromStorage);
  } else {
    return;
  }
};

//validate inputs
const validateFormInputs = () => {};

// -- -- S O R T I N G
// sort items by name
const sortByName = () => {
  const sortedByNameArr = itemsFromStorage.sort((a, b) => {
    if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
  });

  return sortedByNameArr;
};

//filter select event
const filterMenuItems = (e) => {
  if (e.target.value === 'byPriceLowesFirst') {
    const sortedByLowestPrice = itemsFromStorage.sort(
      (a, b) => +a.price - +b.price
    );
    renderMenu(sortedByLowestPrice);
  } else if (e.target.value === 'byPriceHighestFirst') {
    const sortedByhighestPrice = itemsFromStorage.sort(
      (a, b) => +b.price - +a.price
    );
    renderMenu(sortedByhighestPrice);
  } else if (e.target.value === 'byHeatHottest') {
    const sortedByHottest = itemsFromStorage.sort((a, b) => +b.heat - +a.heat);
    renderMenu(sortedByHottest);
  } else if (e.target.value === 'byHeatMildest') {
    const sortedByMildest = itemsFromStorage.sort((a, b) => +a.heat - +b.heat);
    renderMenu(sortedByMildest);
  }
};

// -- -- E V E N T S
document.addEventListener('DOMContentLoaded', () => {
  menufilter.addEventListener('change', filterMenuItems);

  renderMenu(sortByName());

  form.addEventListener('submit', (e) => {
    saveItemToSessionStorage(e);
    renderMenu(sortByName());
  });
});

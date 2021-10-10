// --  Variables
//DOM elements

// --form
const form = document.querySelector('#add-pizza-form');
const pizzaName = document.querySelector('#name');
const pizzaPrice = document.querySelector('#price');
const pizzaHeat = document.querySelector('#heat');
const pizzaToppings = document.querySelector('#toppings');
const pizzaPhotoSelect = document.querySelector('#pizzaPhoto');
const selectedImgOutput = document.querySelector('#selectedImg');
const error = document.querySelectorAll('.error');

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
  } else {
    return '';
  }
};
//pizza photo rendere
const formPhotoRender = () => {
  if (pizzaPhotoSelect.value === 'pizza1') {
    selectedImgOutput.src = './assets/pizzaPhotos/pizzaPhoto1.jpg';
  } else if (pizzaPhotoSelect.value === 'pizza2') {
    selectedImgOutput.src = './assets/pizzaPhotos/pizzaPhoto2.jpg';
  } else if (pizzaPhotoSelect.value === 'pizza3') {
    selectedImgOutput.src = './assets/pizzaPhotos/pizzaPhoto3.jpg';
  } else if (pizzaPhotoSelect.value === 'pizza4') {
    selectedImgOutput.src = './assets/pizzaPhotos/pizzaPhoto4.jpg';
  } else {
    selectedImgOutput.src = '';
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
      <div class="pizza-heat">${
        pizza.heat ? pizzaHeatIconRenderer(+pizza.heat) : ''
      }</div>
      <h5>${pizza.name}</h5>
      <span>${pizza.price}</span>
      <span>${pizza.toppings.join(',')}</span>
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

//save pizza to session storage
const saveItemToSessionStorage = (e) => {
  e.preventDefault();

  let pizzaArr = [];

  if (itemsFromStorage) {
    pizzaArr = itemsFromStorage;
  }

  const pizzaItem = {
    name: pizzaName.value,
    price: Number(pizzaPrice.value).toFixed(2),
    heat: Number(pizzaHeat.value),
    toppings: pizzaToppings.value.split(' '),
    photo: pizzaPhotoSelect.value,
  };

  if (validateFormInputs(pizzaItem)) {
    // adding pizza to the session storage
    pizzaArr.push(pizzaItem);

    updateItemsOnSessionStorage(pizzaArr);

    // resetting the form and error messages if any
    selectedImgOutput.src = '';
    error.forEach((err) => {
      err.innerText = '';
    });
    form.reset();
  }
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
    //deleting item
    itemsFromStorage.splice(indexOfPizzaToRemove, 1);

    //update storage and UI
    updateItemsOnSessionStorage(itemsFromStorage);
    renderMenu(itemsFromStorage);
  } else {
    return;
  }
};

//validate inputs
const validateFormInputs = (pizzaItem) => {
  let valid = true;
  const { name, price, heat, toppings } = pizzaItem;

  //name - must be string, unique, max-length 30
  if (
    typeof name === !'string' ||
    itemsFromStorage.some((item) => item.name === name) ||
    name.length > 30
  ) {
    showError(
      'Pizza name must be unique and no longer than 30 symbols.',
      '.name-error-msg'
    );
    valid = false;
  }
  //price - must be positive number, decimal points 2
  if (price < 0 || isNaN(price)) {
    showError(
      'Pizza price must be a positive number. Ex. 15.99',
      '.price-error-msg'
    );
    valid = false;
  }
  //heat - must be number, integer, range 1-3
  if (isNaN(heat) || !Number.isInteger(heat) || heat > 3 || heat < 0) {
    showError(
      'Pizza heat range must be from 1 to 3 integer number.',
      '.heat-error-msg'
    );
    valid = false;
  }
  //toppings - must be array, min-length 2
  if (toppings.length < 2) {
    showError(
      'Pizza toppings length must be more than 2 words.',
      '.toppings-error-msg'
    );

    valid = false;
  }
  return valid;
};

//create input validation error message
const showError = (error, className) => {
  document.querySelector(className).innerText = error;
};

// -- -- S O R T I N G
// sort items by name
const sortByName = () => {
  const sortedByNameArr = itemsFromStorage.sort((a, b) => {
    if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
  });

  return sortedByNameArr;
};

//select filter: form by select option
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
  } else {
    sortByName();
  }
};

// -- -- E V E N T S
document.addEventListener('DOMContentLoaded', () => {
  menufilter.addEventListener('change', filterMenuItems);

  pizzaPhotoSelect.addEventListener('change', formPhotoRender);

  renderMenu(sortByName());

  form.addEventListener('submit', (e) => {
    saveItemToSessionStorage(e);
    renderMenu(sortByName());
  });
});

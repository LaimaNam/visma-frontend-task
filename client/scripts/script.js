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

/**
 * FUNCTIONS
 */

//  -- -- Session storage

/**
 * Gets items from storage and returns them.
 */
const getItemsFromSessionStorage = () => {
  const items = JSON.parse(sessionStorage.getItem('menuItems'));
  return items === null ? [] : items;
};

/**
 * Updates items in session storage
 *
 * @param {array} arr - takes an array of pizzas.
 */
const updateItemsOnSessionStorage = (arr) => {
  sessionStorage.setItem('menuItems', JSON.stringify(arr));
};

/**
 * Logic helper
 */
const itemsFromStorage = getItemsFromSessionStorage();

//  -- -- UI renderers

/**
 * Renders pizza spiciness level and returns image of pepper *number* times.
 *
 * @param {number} number - number of spiciness level.
 */
const pizzaHeatIconRenderer = (number) => {
  let heat = '';
  for (let i = 0; i < number; i++) {
    heat +=
      '<img src="./assets/icons/chili-pepper2.png" alt="" class="heat-item">';
  }
  return heat;
};

/**
 * Renders pizza photo according to chosen photo string in form.
 *
 * @param {string} photo - selected pizza photo.
 */
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

/**
 * Renders small pizza photo inside the form, according to selected image.
 */
const formPhotoRender = () => {
  selectedImgOutput.src = getPhotoLink(pizzaPhotoSelect.value);
};

/**
 * Returns link to image for selected pizza photo.
 *
 * @param {string} selecValue - selected pizza photo value.
 */
const getPhotoLink = (selecValue) => {
  switch (selecValue) {
    case 'pizza1':
      return './assets/pizzaPhotos/pizzaPhoto1.jpg';
    case 'pizza2':
      return './assets/pizzaPhotos/pizzaPhoto2.jpg';
    case 'pizza3':
      return './assets/pizzaPhotos/pizzaPhoto3.jpg';
    case 'pizza4':
      return './assets/pizzaPhotos/pizzaPhoto4.jpg';
    default:
      return '';
  }
};

/**
 * Renders menu items
 *
 * @param {array} pizzaArray - array of pizzas from session storage.
 */
const renderMenu = (pizzaArray) => {
  if (pizzaArray) {
    menuOutput.innerHTML = pizzaArray.reduce((total, pizza) => {
      total += `
    <div class="menu-item" >
      <button class="delete-item" data-id=${pizza.name}>&#10005</button>
      <div class="menu-item__photo-wrapper">
      <img src="${pizzaPhotoRender(
        pizza.photo
      )}" alt="" class="menu-item__photo" />
      </div>
      <div class="menu-item__pizza-heat">${
        pizza.heat ? pizzaHeatIconRenderer(+pizza.heat) : '---'
      }</div>
      <h3>${pizza.name}</h3>
      <span>€ ${pizza.price}</span>
      <span>${pizza.toppings.join(',')}.</span>
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
  }
};

// -- -- -- LOGIC

/**
 * Saves items to session storage.
 *
 * @param {event} e - submit form event.
 */
const saveItemToSessionStorage = (e) => {
  e.preventDefault();

  const pizzaItem = {
    name: pizzaName.value,
    price: Number(pizzaPrice.value).toFixed(2),
    heat: Number(pizzaHeat.value),
    toppings: pizzaToppings.value.split(','),
    photo: pizzaPhotoSelect.value,
  };

  if (validateFormInputs(pizzaItem)) {
    // adding pizza to the session storage
    itemsFromStorage.push(pizzaItem);

    updateItemsOnSessionStorage(itemsFromStorage);

    // resetting the form and error messages if any
    selectedImgOutput.src = '';
    error.forEach((err) => {
      err.innerText = '';
    });
    form.reset();
  }
};

/**
 * Removes item from session storage and from UI.
 *
 * @param {string} id - menu item id.
 */
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

/**
 * Validates form inputs.
 *
 * @param {object} pizzaItem - object of pizza item.
 */
const validateFormInputs = (pizzaItem) => {
  let valid = true;
  const { name, price, heat, toppings } = pizzaItem;

  //checking if item with this name already exists in session storage
  let isSameName;
  if (itemsFromStorage) {
    isSameName = itemsFromStorage.some((item) => item.name === name);
  }

  //name - must be string, unique, max-length 30
  if (typeof name === !'string' || isSameName || name.length > 30) {
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

/**
 * Creates input validation error message
 *
 * @param {string} className - class name of error message tag
 * @param {string} error - error message
 */
const showError = (error, className) => {
  document.querySelector(className).innerText = error;
};

/**
 *  -- -- S O R T I N G
 */

/**
 * Default sorting by name.
 *
 * @param {array} items - array of menu items.
 */
const sortByName = (items) => {
  if (items) {
    const sortedByNameArr = items.sort((a, b) => {
      if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
    });

    return sortedByNameArr;
  }
};

/**
 * Menu items filter logic: sorts items by name, spiciness and price.
 *
 * @param {event} e - on change event of select.
 */
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
  } else if (e.target.value === 'byName') {
    renderMenu(sortByName(itemsFromStorage));
  }
};

/**
 * -- -- E V E N T S
 */
document.addEventListener('DOMContentLoaded', () => {
  /**
   * Menu filter select element on change event
   */
  menufilter.addEventListener('change', filterMenuItems);

  /**
   * Form select element on change event
   */
  pizzaPhotoSelect.addEventListener('change', formPhotoRender);

  /**
   * On page load renders menu sorted by name (default sorting)
   */
  renderMenu(sortByName(itemsFromStorage));

  /**
   * Form event
   */
  form.addEventListener('submit', (e) => {
    saveItemToSessionStorage(e);
    renderMenu(sortByName(itemsFromStorage));
  });
});

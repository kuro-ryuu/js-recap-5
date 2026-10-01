import {restaurantModal, restaurantRow} from './components.js';
import {baseUrl} from './variables.js';
import {fetchData} from './utils.js';

const restaurantTableBody = document.querySelector('tbody');
const restaurantDialog = document.querySelector('dialog');
let currentMenuRequest = 0;

const updateRestaurantModal = (restaurant, menu) => {
  restaurantDialog.innerHTML = restaurantModal(restaurant, menu);
  if (!restaurantDialog.open) {
    restaurantDialog.showModal();
  }
};

const loadDailyMenu = async restaurant => {
  const {_id} = restaurant;
  const requestId = ++currentMenuRequest;
  const language = document.documentElement.lang
    ? document.documentElement.lang
    : 'en';

  updateRestaurantModal(restaurant, {loading: true});
  try {
    const menu = await fetchData(
      `${baseUrl}/restaurants/daily/${encodeURIComponent(_id)}/${encodeURIComponent(language)}`
    );
    if (requestId === currentMenuRequest) {
      updateRestaurantModal(restaurant, menu);
    }
  } catch (error) {
    if (requestId === currentMenuRequest) {
      console.error('Failed to load menu:', error);
      updateRestaurantModal(restaurant, {error: true});
    }
  }
};

const renderRestaurants = restaurants => {
  const sortedRestaurants = [...restaurants].sort(
    ({name: firstName}, {name: secondName}) =>
      firstName.localeCompare(secondName, 'fi')
  );

  sortedRestaurants.forEach(restaurant => {
    const row = restaurantRow(restaurant);
    const nameCell = row.querySelector('.restaurant-name');

    nameCell.addEventListener('click', () => {
      document.querySelectorAll('.restaurant-name').forEach(element => {
        element.classList.remove('highlight');
      });
      nameCell.classList.add('highlight');
      loadDailyMenu(restaurant);
    });
    restaurantTableBody.append(row);
  });
};

const showRestaurantLoadError = () => {
  const row = document.createElement('tr');
  const errorCell = document.createElement('td');

  errorCell.colSpan = 2;
  errorCell.textContent = 'Error loading restauraints';
  row.append(errorCell);
  restaurantTableBody.append(row);
};

const loadRestaurants = async () => {
  try {
    const restaurants = await fetchData(`${baseUrl}/restaurants`);
    if (!Array.isArray(restaurants)) {
      throw new Error('Restaurant API response was not a list');
    }

    renderRestaurants(restaurants);
  } catch (error) {
    console.error('Failed to load restaurants:', error);
    showRestaurantLoadError();
  }
};

loadRestaurants();

import {restaurantModal, restaurantRow} from './components.js';
import {baseUrl} from './variables.js';
import {fetchData} from './utils.js';

const restaurantTableBody = document.querySelector('tbody');
const restaurantDialog = document.querySelector('dialog');
const companyFilters = document.querySelectorAll(
  'input[name="company-filter"]'
);
let currentMenuRequest = 0;
let allRestaurants = [];

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
  const selectedCompanies = [...companyFilters]
    .filter(({checked}) => checked)
    .map(({value}) => value.toLocaleLowerCase('fi'));
  const rows = restaurants
    .filter(({company}) =>
      selectedCompanies.includes(String(company ?? '').toLocaleLowerCase('fi'))
    )
    .sort(({name: firstName}, {name: secondName}) =>
      firstName.localeCompare(secondName, 'fi')
    )
    .map(restaurant => {
      const row = restaurantRow(restaurant);
      const nameCell = row.querySelector('.restaurant-name');

      nameCell.addEventListener('click', () => {
        document.querySelectorAll('.restaurant-name').forEach(element => {
          element.classList.remove('highlight');
        });
        nameCell.classList.add('highlight');
        loadDailyMenu(restaurant);
      });
      return row;
    });

  restaurantTableBody.replaceChildren(...rows);
  if (rows.length === 0) {
    const emptyRow = document.createElement('tr');
    const emptyCell = document.createElement('td');

    emptyCell.colSpan = 2;
    emptyCell.textContent = 'No restaurants match the selected companies';
    emptyRow.append(emptyCell);
    restaurantTableBody.append(emptyRow);
  }
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

    allRestaurants = restaurants;
    renderRestaurants(allRestaurants);
  } catch (error) {
    console.error('Failed to load restaurants:', error);
    showRestaurantLoadError();
  }
};

companyFilters.forEach(filter => {
  filter.addEventListener('change', () => renderRestaurants(allRestaurants));
});

loadRestaurants();

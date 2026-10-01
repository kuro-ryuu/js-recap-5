const escapeHtml = value =>
  String(value ?? 'Not provided').replace(
    /[&<>"']/g,
    character =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character]
  );

const restaurantRow = restaurant => {
  const {name, company} = restaurant;
  const row = document.createElement('tr');

  row.innerHTML = `<td class="restaurant-name">${escapeHtml(name)}</td><td>${escapeHtml(company)}</td>`;
  return row;
};

const restaurantModal = (restaurant, menu) => {
  const {name, address, postalCode, city, phone, company} = restaurant;
  const {courses = [], loading = false, error = false} = menu ?? {};
  let menuHtml = '';

  if (Array.isArray(courses)) {
    courses.forEach(({name: courseName, price, diets}) => {
      const courseDetails = [price, diets]
        .filter(Boolean)
        .map(escapeHtml)
        .join(' | ');

      menuHtml += `<li><strong>${escapeHtml(courseName)}</strong>${courseDetails ? `: ${courseDetails}` : ''}</li>`;
    });
  }

  if (!menuHtml) {
    const menuMessage = loading
      ? 'Loading menu...'
      : error
        ? "Unable to load today's menu."
        : 'No menu available today.';
    menuHtml = `<p>${menuMessage}</p>`;
  } else {
    menuHtml = `<ul>${menuHtml}</ul>`;
  }

  return `<h2>${escapeHtml(name)}</h2>
    <dl>
      <dt>Address</dt><dd>${escapeHtml(address)}</dd>
      <dt>Postal code</dt><dd>${escapeHtml(postalCode)}</dd>
      <dt>City</dt><dd>${escapeHtml(city)}</dd>
      <dt>Phone number</dt><dd>${escapeHtml(phone)}</dd>
      <dt>Company</dt><dd>${escapeHtml(company)}</dd>
    </dl>
    <section aria-labelledby="restaurant-menu-heading">
      <h3 id="restaurant-menu-heading">Today's menu</h3>
      <div id="restaurant-menu" aria-live="polite">${menuHtml}</div>
    </section>
    <form method="dialog">
      <button type="submit">Close</button>
    </form>`;
};

export {restaurantRow, restaurantModal};

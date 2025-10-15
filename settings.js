// Функции для работы с вкладками
function openTab(tabName) {
  // Скрываем все вкладки
  const tabContents = document.getElementsByClassName('tab-content');
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove('active');
  }

  // Убираем активный класс со всех кнопок
  const tabButtons = document.getElementsByClassName('tab-button');
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove('active');
  }

  // Показываем выбранную вкладку и активируем кнопку
  document.getElementById(tabName).classList.add('active');
  event.currentTarget.classList.add('active');
}

function goBack() {
  window.location.href = 'index.html';
}

// Функции для работы с пленками
function loadFilms() {
  const filmsList = document.getElementById('films-list');
  filmsList.innerHTML = '';

  const customFilms = JSON.parse(localStorage.getItem('customFilms')) || [];
  const defaultFilms = getDefaultFilms();

  // Объединяем все пленки и показываем сначала кастомные
  const allFilms = [...customFilms, ...defaultFilms];

  allFilms.forEach((film, index) => {
    const isCustom = index < customFilms.length;
    const filmElement = createFilmElement(film, !isCustom);
    filmsList.appendChild(filmElement);
  });
}

function getDefaultFilms() {
  return [
    {
      size: '200x200',
      type: 'transparent_frost_standard',
      name: '2×200 мм: Морозостойкие и стандарт (Китай, Франция)',
      wholesale: 180,
      retail: 195,
    },
    {
      size: '200x200',
      type: 'colored_china',
      name: '2×200 мм: Цветной Китай',
      wholesale: 200,
      retail: 220,
    },
    {
      size: '200x200',
      type: 'colored_france',
      name: '2×200 мм: Матовая и цветная (Франция)',
      wholesale: 270,
      retail: 295,
    },
    { size: '200x200', type: 'eco', name: '2×200 мм: Eco', wholesale: 150, retail: 165 },
    {
      size: '300x300',
      type: 'transparent_frost_standard',
      name: '3×300 мм: Морозостойкие и стандарт (Китай)',
      wholesale: 290,
      retail: 305,
    },
    {
      size: '300x300',
      type: 'transparent_ribbed_frost',
      name: '3×300 мм: Рифленная морозостойкая (Китай)',
      wholesale: 360,
      retail: 395,
    },
    { size: '300x300', type: 'eco', name: '3×300 мм: Eco', wholesale: 250, retail: 265 },
  ];
}

function createFilmElement(film, isDefault = false) {
  const filmDiv = document.createElement('div');
  filmDiv.className = `film-item ${isDefault ? 'default' : 'custom'}`;

  filmDiv.innerHTML = `
    <div class="film-header">
      <h4>${film.name}</h4>
      <button class="delete-button" onclick="deleteFilm('${film.type}', ${isDefault})">×</button>
    </div>
    <div class="film-inputs">
      <label>
        Размер: 
        <select onchange="updateFilmProperty('${film.type}', 'size', this.value, ${isDefault})">
          <option value="200x200" ${film.size === '200x200' ? 'selected' : ''}>200x200 мм</option>
          <option value="300x300" ${film.size === '300x300' ? 'selected' : ''}>300x300 мм</option>
        </select>
      </label>
      <label>Название: <input type="text" value="${film.name}" onchange="updateFilmProperty('${
    film.type
  }', 'name', this.value, ${isDefault})"></label>
      <label>Цена опт: <input type="number" value="${
        film.wholesale
      }" step="0.01" min="0" onchange="updateFilmProperty('${
    film.type
  }', 'wholesale', parseFloat(this.value), ${isDefault})"></label>
      <label>Цена розница: <input type="number" value="${
        film.retail
      }" step="0.01" min="0" onchange="updateFilmProperty('${
    film.type
  }', 'retail', parseFloat(this.value), ${isDefault})"></label>
    </div>
  `;

  return filmDiv;
}

function addNewFilm() {
  const newFilm = {
    size: '200x200',
    type: 'custom_' + Date.now(),
    name: 'Новая пленка',
    wholesale: 0,
    retail: 0,
  };

  const customFilms = JSON.parse(localStorage.getItem('customFilms')) || [];
  customFilms.unshift(newFilm);
  localStorage.setItem('customFilms', JSON.stringify(customFilms));

  loadFilms();
}

function updateFilmProperty(filmType, property, value, isDefault) {
  if (isDefault) {
    // Для пленок по умолчанию создаем кастомную копию
    const defaultFilms = getDefaultFilms();
    const originalFilm = defaultFilms.find((film) => film.type === filmType);

    if (originalFilm) {
      let customFilms = JSON.parse(localStorage.getItem('customFilms')) || [];
      // Удаляем старую кастомную версию если есть
      customFilms = customFilms.filter((film) => film.type !== filmType);

      // Создаем новую кастомную версию
      const customFilm = {
        ...originalFilm,
        [property]: value,
      };
      customFilms.unshift(customFilm);
      localStorage.setItem('customFilms', JSON.stringify(customFilms));
    }
  } else {
    // Для кастомных пленок просто обновляем
    let customFilms = JSON.parse(localStorage.getItem('customFilms')) || [];
    const filmIndex = customFilms.findIndex((film) => film.type === filmType);

    if (filmIndex !== -1) {
      customFilms[filmIndex][property] = value;
      localStorage.setItem('customFilms', JSON.stringify(customFilms));
    }
  }

  loadFilms();
}

function deleteFilm(filmType, isDefault) {
  if (isDefault) {
    // Для пленок по умолчанию - удаляем кастомную версию если она есть
    let customFilms = JSON.parse(localStorage.getItem('customFilms')) || [];
    customFilms = customFilms.filter((film) => film.type !== filmType);
    localStorage.setItem('customFilms', JSON.stringify(customFilms));
  } else {
    // Для кастомных пленок - удаляем полностью
    let customFilms = JSON.parse(localStorage.getItem('customFilms')) || [];
    customFilms = customFilms.filter((film) => film.type !== filmType);
    localStorage.setItem('customFilms', JSON.stringify(customFilms));
  }

  loadFilms();
}

// Функции для загрузки и сохранения настроек
function loadAllSettings() {
  loadFilms();
  loadFastenersPrices();
  loadPercentages();
}

function loadFastenersPrices() {
  const savedPrices = JSON.parse(localStorage.getItem('fastenersPrices')) || {};

  // Используем значения по умолчанию если нет сохраненных
  const defaultPrices = {
    galvanized_plank_200_wholesale: 50,
    galvanized_plank_200_retail: 65,
    galvanized_plank_300_wholesale: 60,
    galvanized_plank_300_retail: 75,
    galvanized_comb_wholesale: 285,
    galvanized_comb_retail: 295,
    stainless_plank_200_wholesale: 80,
    stainless_plank_200_retail: 85,
    stainless_plank_300_wholesale: 90,
    stainless_plank_300_retail: 105,
    stainless_comb_wholesale: 550,
    stainless_comb_retail: 550,
  };

  Object.keys(defaultPrices).forEach((key) => {
    document.getElementById(key).value = savedPrices[key] || defaultPrices[key];
  });
}

function loadPercentages() {
  const savedPercentages = JSON.parse(localStorage.getItem('manufacturingPercentages')) || {};
  document.getElementById('wholesale_percentage').value = savedPercentages.wholesale || 10;
  document.getElementById('retail_percentage').value = savedPercentages.retail || 12;
}

function saveAllSettings() {
  // Сохраняем цены на крепления
  const fastenersPrices = {
    galvanized_plank_200_wholesale: parseFloat(
      document.getElementById('galvanized_plank_200_wholesale').value,
    ),
    galvanized_plank_200_retail: parseFloat(
      document.getElementById('galvanized_plank_200_retail').value,
    ),
    galvanized_plank_300_wholesale: parseFloat(
      document.getElementById('galvanized_plank_300_wholesale').value,
    ),
    galvanized_plank_300_retail: parseFloat(
      document.getElementById('galvanized_plank_300_retail').value,
    ),
    galvanized_comb_wholesale: parseFloat(
      document.getElementById('galvanized_comb_wholesale').value,
    ),
    galvanized_comb_retail: parseFloat(document.getElementById('galvanized_comb_retail').value),
    stainless_plank_200_wholesale: parseFloat(
      document.getElementById('stainless_plank_200_wholesale').value,
    ),
    stainless_plank_200_retail: parseFloat(
      document.getElementById('stainless_plank_200_retail').value,
    ),
    stainless_plank_300_wholesale: parseFloat(
      document.getElementById('stainless_plank_300_wholesale').value,
    ),
    stainless_plank_300_retail: parseFloat(
      document.getElementById('stainless_plank_300_retail').value,
    ),
    stainless_comb_wholesale: parseFloat(document.getElementById('stainless_comb_wholesale').value),
    stainless_comb_retail: parseFloat(document.getElementById('stainless_comb_retail').value),
  };

  localStorage.setItem('fastenersPrices', JSON.stringify(fastenersPrices));

  // Сохраняем проценты
  const manufacturingPercentages = {
    wholesale: parseFloat(document.getElementById('wholesale_percentage').value),
    retail: parseFloat(document.getElementById('retail_percentage').value),
  };

  localStorage.setItem('manufacturingPercentages', JSON.stringify(manufacturingPercentages));

  // Показываем сообщение об успешном сохранении
  showSaveMessage();
}

function showSaveMessage() {
  const message = document.createElement('div');
  message.className = 'save-message';
  message.textContent = 'Настройки успешно сохранены!';
  document.querySelector('.save-buttons').appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 3000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', loadAllSettings);

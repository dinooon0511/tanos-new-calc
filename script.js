const defaultPrices = {
  wholesale: {
    '200x200': {
      transparent_frost_standard: 180,
      colored_china: 200,
      colored_france: 270,
      eco: 150,
    },
    '300x300': {
      transparent_frost_standard: 290,
      transparent_ribbed_frost: 360,
      eco: 250,
    },
  },
  retail: {
    '200x200': {
      transparent_frost_standard: 195,
      colored_china: 220,
      colored_france: 295,
      eco: 165,
    },
    '300x300': {
      transparent_frost_standard: 305,
      transparent_ribbed_frost: 395,
      eco: 265,
    },
  },
};

const defaultFastenersPrices = {
  wholesale: {
    galvanized: {
      plank_200: 50,
      plank_300: 60,
      comb: 285,
    },
    stainless: {
      plank_200: 80,
      plank_300: 90,
      comb: 550,
    },
  },
  retail: {
    galvanized: {
      plank_200: 65,
      plank_300: 75,
      comb: 295,
    },
    stainless: {
      plank_200: 85,
      plank_300: 105,
      comb: 550,
    },
  },
};

const stripsPerMeter = {
  '200x200': {
    galvanized: { '40mm': 6, '80mm': 8 },
    stainless: { '50mm': 7, '100mm': 10 },
  },
  '300x300': {
    galvanized: { '40mm': 4, '80mm': 4.8 },
    stainless: { '50mm': 4, '100mm': 5 },
  },
};

// Функции для получения данных с учетом кастомных
function getPrices() {
  const customFilms = JSON.parse(localStorage.getItem('customFilms')) || [];
  const prices = JSON.parse(JSON.stringify(defaultPrices));

  customFilms.forEach((film) => {
    if (!prices.wholesale[film.size]) {
      prices.wholesale[film.size] = {};
      prices.retail[film.size] = {};
    }
    prices.wholesale[film.size][film.type] = film.wholesale;
    prices.retail[film.size][film.type] = film.retail;
  });

  return prices;
}

function getFastenersPrices() {
  const customPrices = JSON.parse(localStorage.getItem('fastenersPrices')) || {};
  const prices = JSON.parse(JSON.stringify(defaultFastenersPrices));

  if (customPrices.galvanized_plank_200_wholesale !== undefined) {
    prices.wholesale.galvanized.plank_200 = customPrices.galvanized_plank_200_wholesale;
    prices.retail.galvanized.plank_200 = customPrices.galvanized_plank_200_retail;
    prices.wholesale.galvanized.plank_300 = customPrices.galvanized_plank_300_wholesale;
    prices.retail.galvanized.plank_300 = customPrices.galvanized_plank_300_retail;
    prices.wholesale.galvanized.comb = customPrices.galvanized_comb_wholesale;
    prices.retail.galvanized.comb = customPrices.galvanized_comb_retail;

    prices.wholesale.stainless.plank_200 = customPrices.stainless_plank_200_wholesale;
    prices.retail.stainless.plank_200 = customPrices.stainless_plank_200_retail;
    prices.wholesale.stainless.plank_300 = customPrices.stainless_plank_300_wholesale;
    prices.retail.stainless.plank_300 = customPrices.stainless_plank_300_retail;
    prices.wholesale.stainless.comb = customPrices.stainless_comb_wholesale;
    prices.retail.stainless.comb = customPrices.stainless_comb_retail;
  }

  return prices;
}

function getManufacturingPercentages() {
  return (
    JSON.parse(localStorage.getItem('manufacturingPercentages')) || { wholesale: 10, retail: 12 }
  );
}

// Функция для динамического заполнения вариантов перекрытия
function populateOverlapOptions() {
  const fastenersInputs = document.getElementsByName('fasteners');
  let fasteners;
  for (const input of fastenersInputs) {
    if (input.checked) {
      fasteners = input.value;
      break;
    }
  }

  const overlapOptions = document.getElementById('overlap-options');
  overlapOptions.innerHTML = '';

  if (fasteners === 'galvanized') {
    overlapOptions.innerHTML = `
      <label>
        <input type="radio" name="overlap" value="40mm" onchange="calculateCost()">
        40 мм
      </label>
      <label>
        <input type="radio" name="overlap" value="80mm" onchange="calculateCost()">
        80 мм
      </label>
    `;
  } else if (fasteners === 'stainless') {
    overlapOptions.innerHTML = `
      <label>
        <input type="radio" name="overlap" value="50mm" onchange="calculateCost()">
        50 мм
      </label>
      <label>
        <input type="radio" name="overlap" value="100mm" onchange="calculateCost()">
        100 мм
      </label>
    `;
  } else {
    overlapOptions.innerHTML = '<p>Сначала выберите тип крепежей.</p>';
  }
}

// Функция для заполнения вариантов пленок
function populateFilmOptions() {
  const typeOptions = document.getElementById('type-options');
  typeOptions.innerHTML = '';

  const customFilms = JSON.parse(localStorage.getItem('customFilms')) || [];
  const defaultFilms = getDefaultFilms();
  const allFilms = [...customFilms, ...defaultFilms];

  allFilms.forEach((film) => {
    const label = document.createElement('label');
    label.innerHTML = `
      <input
        type="radio"
        name="type"
        value="${film.size}_${film.type}"
        onchange="calculateCost()"
      />
      ${film.name}
    `;
    typeOptions.appendChild(label);
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

function calculateCost() {
  const prices = getPrices();
  const fastenersPrices = getFastenersPrices();
  const percentages = getManufacturingPercentages();

  // Получаем выбранный тип завесы
  const typeInputs = document.getElementsByName('type');
  let selectedType;
  for (const input of typeInputs) {
    if (input.checked) {
      selectedType = input.value;
      break;
    }
  }

  // Получаем размеры проёма в мм
  const widthMm = parseFloat(document.getElementById('width').value) || 0;
  const heightMm = parseFloat(document.getElementById('height').value) || 0;

  const widthM = widthMm / 1000;
  const heightM = heightMm / 1000;

  // Получаем выбранный тип крепежей
  const fastenersInputs = document.getElementsByName('fasteners');
  let fasteners;
  for (const input of fastenersInputs) {
    if (input.checked) {
      fasteners = input.value;
      break;
    }
  }

  // Получаем выбранное перекрытие
  const overlapInputs = document.getElementsByName('overlap');
  let overlap;
  for (const input of overlapInputs) {
    if (input.checked) {
      overlap = input.value;
      break;
    }
  }

  // Проверки ввода
  if (!selectedType) {
    document.getElementById('result').innerHTML = '<p>Выберите тип завесы.</p>';
    return;
  }
  if (!fasteners) {
    document.getElementById('result').innerHTML = '<p>Выберите тип крепежей.</p>';
    return;
  }
  if (!overlap) {
    document.getElementById('result').innerHTML = '<p>Выберите перекрытие.</p>';
    return;
  }
  if (widthMm <= 0 || heightMm <= 0) {
    document.getElementById('result').innerHTML =
      '<p>Укажите корректные размеры проёма (больше 0).</p>';
    return;
  }

  // Определяем размер завесы на основе выбранного типа
  const [size, typeKey] = selectedType.split('_', 2);
  const fullTypeKey = selectedType.replace(size + '_', '');

  // Рассчитываем количество полос
  const stripsPerM = stripsPerMeter[size][fasteners][overlap];
  const totalStrips = Math.ceil(stripsPerM * widthM);

  // Общее количество материала (в погонных метрах)
  const totalMaterial = totalStrips * heightM;

  // Стоимость материала для опта и розницы
  const materialCostWholesale = totalMaterial * prices.wholesale[size][fullTypeKey];
  const materialCostRetail = totalMaterial * prices.retail[size][fullTypeKey];

  // Количество планок и их стоимость
  const plankSize = size === '200x200' ? 'plank_200' : 'plank_300';
  const plankCostWholesale = fastenersPrices.wholesale[fasteners][plankSize];
  const plankCostRetail = fastenersPrices.retail[fasteners][plankSize];

  const totalPlanks = totalStrips;
  const planksCostWholesale = totalPlanks * plankCostWholesale;
  const planksCostRetail = totalPlanks * plankCostRetail;

  // Количество гребёнок - 1 комплект на каждый метр ширины проема
  const totalCombs = Math.ceil(widthM); // Изменено: 1 гребенка на метр
  const combCostWholesale = fastenersPrices.wholesale[fasteners]['comb'];
  const combCostRetail = fastenersPrices.retail[fasteners]['comb'];

  const combsCostWholesale = totalCombs * combCostWholesale;
  const combsCostRetail = totalCombs * combCostRetail;

  // Общая стоимость без изготовления
  const subtotalWholesale = materialCostWholesale + planksCostWholesale + combsCostWholesale;
  const subtotalRetail = materialCostRetail + planksCostRetail + combsCostRetail;

  // Добавляем проценты за изготовление
  const manufacturingFeeWholesale = subtotalWholesale * (percentages.wholesale / 100);
  const manufacturingFeeRetail = subtotalRetail * (percentages.retail / 100);

  const totalCostWholesale = subtotalWholesale + manufacturingFeeWholesale;
  const totalCostRetail = subtotalRetail + manufacturingFeeRetail;

  // Отображаем обе итоговые стоимости
  document.getElementById('result').innerHTML = `
    <div class="pricing-container">
      <div class="price-block wholesale">
        <h3>Оптовая цена</h3>
        <div class="total-cost">${totalCostWholesale.toFixed(2)} руб</div>
        <div class="price-details">
          <p>Полосы: ${totalStrips} шт × ${heightM.toFixed(1)} м</p>
          <p>Материал: ${materialCostWholesale.toFixed(2)} руб</p>
          <p>Планки: ${planksCostWholesale.toFixed(2)} руб</p>
          <p>Гребенка: ${totalCombs} шт × ${combCostWholesale.toFixed(
    2,
  )} руб = ${combsCostWholesale.toFixed(2)} руб</p>
          <p>Изготовление (${percentages.wholesale}%): ${manufacturingFeeWholesale.toFixed(
    2,
  )} руб</p>
        </div>
      </div>
      <div class="price-block retail">
        <h3>Розничная цена</h3>
        <div class="total-cost">${totalCostRetail.toFixed(2)} руб</div>
        <div class="price-details">
          <p>Полосы: ${totalStrips} шт × ${heightM.toFixed(1)} м</p>
          <p>Материал: ${materialCostRetail.toFixed(2)} руб</p>
          <p>Планки: ${planksCostRetail.toFixed(2)} руб</p>
          <p>Гребенка: ${totalCombs} шт × ${combCostRetail.toFixed(
    2,
  )} руб = ${combsCostRetail.toFixed(2)} руб</p>
          <p>Изготовление (${percentages.retail}%): ${manufacturingFeeRetail.toFixed(2)} руб</p>
        </div>
      </div>
    </div>
  `;
}

function openSettings() {
  window.location.href = 'settings.html';
}

// Добавляем обработчики событий для радиокнопок крепежей
document.addEventListener('DOMContentLoaded', function () {
  const fastenersInputs = document.getElementsByName('fasteners');
  for (const input of fastenersInputs) {
    input.addEventListener('change', () => {
      populateOverlapOptions();
      calculateCost();
    });
  }

  // Инициализация при загрузке страницы
  populateFilmOptions();
  populateOverlapOptions();
});

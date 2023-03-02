// TODO: Move these to local function variables
let payoutArray = [[], [], [], [], [], []];
let lottoMaxNumber = 0;
let lottoMaxOddBall = 0;
let lottoTicketCost = 0;

$(document).ready(function() {
  setPowerballParameters();
});

function performCalculations() {
  refreshVariables();
  getAllCombinations();
}

function getPayoutId(x, y) {
  return '#win_' + x + '_' + y;
}

function getCombinationId(x, y) {
  return '#combinations_' + x + '_' + y + '_span';
}

function getProbabilityId(x, y) {
  return '#probability_' + x + '_' + y + '_span';
}

function getEVId(x, y) {
  return '#expectedvalue_' + x + '_' + y + '_span';
}

function refreshVariables() {
  refreshPayoutArray();

  lottoMaxNumber = parseInt($('#mainNumberBalls').val());
  lottoMaxOddBall = parseInt($('#oddBalls').val());
  lottoTicketCost = parseInt($('#ticketCost').val());
}

function refreshPayoutArray() {
  let i, j;
  for (i = 0; i < 6; i++) {
    for (j = 0; j < 2; j++) {
      payoutArray[i][j] = parseInt($(getPayoutId(i, j)).val());
    }
  }
}

function setPowerballParameters() {
  let prizeArray = [
    [0, 4],
    [0, 4],
    [0, 7],
    [7, 100],
    [100, 50000],
    [1000000, 100000000]
  ];

  setParameters(2, 69, 26, prizeArray);
}

function setMegaMillionsParameters() {
  let prizeArray = [
    [0, 2],
    [0, 4],
    [0, 10],
    [10, 200],
    [500, 10000],
    [1000000, 100000000]
  ];

  setParameters(2, 70, 25, prizeArray);
}

function setParameters(ticketCost, mainBallCount, oddBallCount, prizeArray) {
  $('#mainNumberBalls').val(mainBallCount);
  $('#oddBalls').val(oddBallCount);
  $('#ticketCost').val(ticketCost);
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 2; j++) {
      $(getPayoutId(i, j)).val(prizeArray[i][j]);
    }
  }
  performCalculations();
}

function getAllCombinations() {
  let combinations;
  let currentReturn = 0.00;
  let totalReturn = 0.00;
  let totalCombinations = getTotalCombinations();

  let valueData = [];

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 2; j++) {
      let index = i * 2 + j;

      combinations = combin2(5, i) * combin2(lottoMaxNumber - 5, 5 - i) * combin2(1, 1 - j) * combin2(lottoMaxOddBall - 1, 1 - j);
      currentReturn = payoutArray[i][j] * combinations / totalCombinations / lottoTicketCost;
      totalReturn += currentReturn;

      let oddsDenominator = totalCombinations / combinations;

      $(getCombinationId(i, j)).text((combinations).toLocaleString());
      $(getProbabilityId(i, j)).text('1 in ' + oddsDenominator.toLocaleString());
      $(getEVId(i, j)).text(currentReturn.toFixed(6));
      if (payoutArray[i][j] === 0) {
        $(getEVId(i, j)).attr('class', 'data-neutral');
      }
      else {
        $(getEVId(i, j)).attr('class', '');
      }
      valueData[index] = currentReturn;
    }
  }

  $('#totalCombinations').text(totalCombinations.toLocaleString());
  // TODO: Don't cheat below
  $('#totalProbability').text('1.000000');
  $('#totalReturn').text(totalReturn.toFixed(6));

  updateChart(valueData);  
}

function getTotalCombinations() {
  return combin2(lottoMaxNumber, 5) * lottoMaxOddBall;
}

function combin2(n, r) {
  // TODO: Make this cleaner
  return parseInt(factorial(n) / factorial(r) / factorial(n-r) + 0.01);
}

function factorial(n) {
  let i;
  let returnValue = 1;
  for (i = 2; i <= n; i++) {
    returnValue *= i;
  }

  return returnValue;
}

function updateChart(valueData) {

  let cardChart = document.getElementById("valueChart");
  if (cardChart) {
    cardChart.remove();
  }

  let canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'valueChart');
  canvas.setAttribute('width', '500');
  canvas.setAttribute('min-width', '500');
  canvas.setAttribute('max-width', '500');
  canvas.setAttribute('height', '400');
  canvas.setAttribute('min-height', '400');
  canvas.setAttribute('max-height', '400');
  document.querySelector('#canvasContainer').appendChild(canvas);

  const ctx = $('#valueChart');

  const myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [
        '',
        '🔴',
        '⚪',
        '⚪+🔴',
        '⚪⚪',
        '⚪⚪+🔴',
        '⚪⚪⚪',
        '⚪⚪⚪+🔴',
        '⚪⚪⚪⚪',
        '⚪⚪⚪⚪+🔴',
        '⚪⚪⚪⚪⚪',
        '⚪⚪⚪⚪⚪+🔴'
      ],
      datasets: [{
        label: '',
        data: valueData,
        backgroundColor: [
          'rgb(32, 32, 32)',
          'rgb(255, 139, 105)',
          'rgb(64, 64, 64)',
          'rgb(251, 213, 103)',
          'rgb(96, 96, 96)',
          'rgb(148, 223, 232)',
          'rgb(31, 177, 170)',
          'rgb(131, 88, 162)',
          'rgb(77, 139, 86)',
          'rgb(141, 159, 208)',
          'rgb(66, 115, 176)',
          'rgb(215, 39, 39)'
        ],
        }]
    },
    options: {
      plugins: {
          legend: {
            display: false,
            position: 'left',
            reverse: true,
            labels: {
              color: 'rgb(128, 128, 128)'
          }
        }
      }
    }
});    
}
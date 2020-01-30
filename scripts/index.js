/* eslint-disable no-plusplus */
/*  POSSIBLE OUTCOMES
----------------------------------------------------------
ID?     choice? winner? hint?   RESULT of switching?
C1      1       1       2 / 3   <--- LOSE if you switch
C2      2       2       1 / 3   <--- LOSE if you switch
C3      3       3       1 / 2   <--- LOSE if you switch
C4      1       2       3       <--- WIN if you switch
C5      2       1       3       <--- WIN if you switch
C6      3       1       2       <--- WIN if you switch
C7      1       3       2       <--- WIN if you switch
C8      2       3       1       <--- WIN if you switch
C9      3       2       1       <--- WIN if you switch
--------------------------------------------------------*/

/*  VARIABLES
--------------------------------------------------------*/
// used to determine the winning door
let randomNum;

// holds the winning door as a number (1, 2 or 3)
let winner;
let choice;
let hint;

// bool to capture user choice whether to stay or switch
let switchDoor;

// stats counters
let switchWins = 0;
let stayWins = 0;
let switchLosses = 0;
let stayLosses = 0;
let switchTotal = 0;
let stayTotal = 0;
let switchPercentage = 0;
let stayPercentage = 0;

// captures state of puzzle based on random occurrence of game (1-9)
let internalChoice;
let internalWinner;
let internalHint;
let internalOption;

// captures the random occurrence of game and stores it as a version #
let version;

/*  FUNCTIONS
--------------------------------------------------------*/
// JQUERY DIALOG BOX FUNCTIONS
$(() => {
  $('#aboutDialog').dialog({
    autoOpen: false,
  });
  $('#about').click(() => {
    $('#aboutDialog').dialog('open');
  });
});

$(() => {
  $('#rulesDialog').dialog({
    autoOpen: false,
  });
  $('#rules').click(() => {
    $('#rulesDialog').dialog('open');
  });
});

$(() => {
  $('#statsDialog').dialog({
    autoOpen: false,
  });
  $('#stats').click(() => {
    stats();
    $('#statsDialog').dialog('open');
  });
});

// OPERATIONAL -- alerts the user when stats button is clicked regarding win/loss types
function stats() {
  stayTotal = stayWins + stayLosses;

  switchTotal = switchWins + switchLosses;

  stayPercentage = stayWins / stayTotal;
  stayPercentage *= 100;
  stayPercentage = Math.round(stayPercentage);
  stayPercentage += '%';

  switchPercentage = switchWins / switchTotal;
  switchPercentage *= 100;
  switchPercentage = Math.round(switchPercentage);
  switchPercentage += '%';

  if (switchTotal === 0) {
    switchPercentage = 'N/A';
  }
  if (stayTotal === 0) {
    stayPercentage = 'N/A';
  }

  document.querySelector('#statsDialog').innerHTML = `
      <b>WHEN I'VE SWITCHED:</b><br>
      - Win Rate: ${switchPercentage}<br>
      - Wins: ${switchWins}<br>
      - Losses: ${switchLosses}<br><br>
      <b>WHEN I'VE STAYED:</b><br>
      - Win Rate: ${stayPercentage}<br>
      - Wins: ${stayWins}<br>
      - Losses: ${stayLosses}`;
}

// OPERATIONAL: switches to second set of doors after first choice is made (called by letsGo function)
function rotateDoors() {
  document.querySelector('#doors').style.display = 'none';
  document.querySelector('#doors2').style.display = 'flex';
}

// OPERATIONAL -- resets gameplay (but keeps stats)
function reset() {
  // reset all variables other than stats
  version = undefined;
  randomNum = undefined;
  winner = undefined;
  choice = undefined;
  hint = undefined;
  switchDoor = undefined;
  internalChoice = undefined;
  internalWinner = undefined;
  internalHint = undefined;
  internalOption = undefined;
  stats();
  // reswitch doors
  document.querySelector('#doors').style.display = 'flex';
  document.querySelector('#doors2').style.display = 'none';
  // revert to invitation to play
  document.querySelector(
    '#message',
  ).innerHTML = '<p class="message">Choose any door above to play! ☝️ 🚪 🐐 🚗</p>';
  // revert stylesheet state
  document.getElementById('hoversheet12').disabled = false;
  document.getElementById('hoversheet22').disabled = false;
  document.getElementById('hoversheet32').disabled = false;
  // revert onclick status of doors2
  document.querySelector('#door12').setAttribute('onclick', '');
  document.querySelector('#door22').setAttribute('onclick', '');
  document.querySelector('#door32').setAttribute('onclick', '');
  // revert doors2 innerHTML text (i.e., door label)
  document.querySelector(
    '#door12',
  ).innerHTML = '<b class="doortitle">Door #1</b>';
  document.querySelector(
    '#door22',
  ).innerHTML = '<b class="doortitle">Door #2</b>';
  document.querySelector(
    '#door32',
  ).innerHTML = '<b class="doortitle">Door #3</b>';
  // revert doors2 text color
  document.querySelector('#door12').style.backgroundColor = '#333333';
  document.querySelector('#door22').style.backgroundColor = '#333333';
  document.querySelector('#door32').style.backgroundColor = '#333333';
  // revert doors2 background image
  document.querySelector('#door12').style.backgroundImage = 'url(./assets/door.jpg)';
  document.querySelector('#door22').style.backgroundImage = 'url(./assets/door.jpg)';
  document.querySelector('#door32').style.backgroundImage = 'url(./assets/door.jpg)';
  // get rid of play again button
  document.querySelector('#reset').style.display = 'none';
}

// CORE GAME LOGIC, STEP 3: Takes a true value if the user switches doors and a false value if the user stays and spits out the appropriate state based on that choice (and updates game stats based on results)
function switchDoors(bool) {
  switchDoor = bool;
  document.querySelector('#door12').innerHTML = '';
  document.querySelector('#door22').innerHTML = '';
  document.querySelector('#door32').innerHTML = '';
  document.getElementById('hoversheet12').disabled = true;
  document.getElementById('hoversheet22').disabled = true;
  document.getElementById('hoversheet32').disabled = true;
  document.getElementById('stats').style.display = 'block';
  document.querySelector('#door12').onclick = '';
  document.querySelector('#door22').onclick = '';
  document.querySelector('#door32').onclick = '';
  if (version === 1 || version === 2 || version === 3) {
    document.querySelector(`#door${internalOption}2`).style.backgroundImage = 'url(./assets/goat.jpg)';
    document.querySelector(`#door${internalChoice}2`).style.backgroundImage = 'url(./assets/car.jpg)';
    if (switchDoor === true) {
      switchLosses++;
      document.querySelector(
        '#message',
      ).innerHTML = `<p class="lose">Uh oh, you lost. The car was behind door #${internalChoice}. In this case, it didn't work to switch doors.</p>`;
    } else if (switchDoor === false) {
      stayWins++;
      document.querySelector(
        '#message',
      ).innerHTML = `<p class="win">You win! In this case, it worked to stay with door #${internalChoice}.`;
    }
  } else {
    document.querySelector(`#door${internalOption}2`).style.backgroundImage = 'url(./assets/car.jpg)';
    document.querySelector(`#door${internalChoice}2`).style.backgroundImage = 'url(./assets/goat.jpg)';

    if (switchDoor === true) {
      switchWins++;
      document.querySelector(
        '#message',
      ).innerHTML = `<p class="win">You win! Nice strategy switching to door #${internalOption}.</p>`;
    } else if (switchDoor === false) {
      stayLosses++;
      document.querySelector(
        '#message',
      ).innerHTML = `<p class="lose">Uh oh, you lost. The car was behind door #${internalOption}. Maybe next time you should switch doors?`;
    }
  }
  document.querySelector('#reset').style.display = 'block';
  stats();
}

// CORE GAME LOGIC, STEP 2: takes user's choice and randomly generated numbers to set up game state following first click.
function letsGo(userChoice, userWinner, userHint, option) {
  internalChoice = userChoice;
  internalWinner = userWinner;
  internalHint = userHint;
  internalOption = option;
  rotateDoors();
  document.getElementById(`hoversheet${internalHint}2`).disabled = true;
  document.querySelector(
    '#message',
  ).innerHTML = `Alright, you chose door #${internalChoice}, and now we know there's a goat behind door #${internalHint}. This means the car is either behind door #${internalChoice} (your original choice) or door #${internalOption}. Click on door #${internalChoice} to stay or door #${internalOption} to switch. Good luck!`;
  document
    .querySelector(`#door${internalChoice}2`)
    .setAttribute('onclick', 'switchDoors(false)');
  document
    .querySelector(`#door${internalOption}2`)
    .setAttribute('onclick', 'switchDoors(true)');
  document.querySelector(
    `#door${internalOption}2`,
  ).innerHTML = `<b class="doortitle">Door #${internalOption}</b><p>Click here to SWITCH</p>`;
  document.querySelector(
    `#door${internalChoice}2`,
  ).innerHTML = `<b class="doortitle">Door #${internalChoice}</b><p>Click here to STAY</p>`;
  document.querySelector(`#door${internalHint}2`).style.backgroundImage = 'url(./assets/goat.jpg)';
  document.querySelector(`#door${internalHint}2`).innerHTML = '';
}

// CORE GAME LOGIC, STEP 1: takes user choice, generates random numbers and sets game version based on user's first chosen door and randomly generated winning door
function play(chosenDoor) {
  // GET RANDOM NUMBERS AND SET RELATED VARIABLES
  randomNum = Math.random();
  if (randomNum < 0.333333334) {
    winner = 1;
  } else if (randomNum > 0.333333333 && randomNum < 0.666666667) {
    winner = 2;
  } else {
    winner = 3;
  }
  choice = chosenDoor;
  hint = Math.round(Math.random()); // will output either 0 or 1

  // Version C1 (choice=1, winner=1, hint=2/3)
  if (choice === 1 && winner === 1) {
    version = 1;
    if (hint === 0) {
      // hint=2
      letsGo(1, 1, 2, 3);
    } else {
      // hint=3
      letsGo(1, 1, 3, 2);
    }
  }
  // Version C2 (choice=2, winner=2, hint=1/3)
  if (choice === 2 && winner === 2) {
    version = 2;
    if (hint === 0) {
      // hint=1
      letsGo(2, 2, 1, 3);
    } else {
      // hint=3
      letsGo(2, 2, 3, 1);
    }
  }
  // Version C3 (choice=3, winner=3, hint=1/2)
  if (choice === 3 && winner === 3) {
    version = 3;
    if (hint === 0) {
      // hint=1
      letsGo(3, 3, 1, 2);
    } else {
      // hint=2
      letsGo(3, 3, 2, 1);
    }
  }
  // Version C4 (choice=1, winner=2, hint=3)
  if (choice === 1 && winner === 2) {
    version = 4;
    letsGo(1, 2, 3, 2);
  }
  // Version C5 (choice=2, winner=1, hint=3)
  if (choice === 2 && winner === 1) {
    version = 5;
    letsGo(2, 1, 3, 1);
  }
  // Version C6 (choice=3, winner=1, hint=2)
  if (choice === 3 && winner === 1) {
    version = 6;
    letsGo(3, 1, 2, 1);
  }
  // Version C7 (choice=1, winner=3, hint=2)
  if (choice === 1 && winner === 3) {
    version = 7;
    letsGo(1, 3, 2, 3);
  }
  // Version C8 (choice=2, winner=3, hint=1)
  if (choice === 2 && winner === 3) {
    version = 8;
    letsGo(2, 3, 1, 3);
  }
  // Version C9 (choice=3, winner=2, hint=1)
  if (choice === 3 && winner === 2) {
    version = 9;
    letsGo(3, 2, 1, 2);
  }
}

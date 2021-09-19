const PLAYER_LIST_STORAGE_KEY = "playerList";

const State = {
  playerList: [],
  game: null
}

function loadState(){
  const playerListStoredString = window.localStorage.getItem(PLAYER_LIST_STORAGE_KEY);
  State.playerList = playerListStoredString ? JSON.parse(playerListStoredString) : [];
  populatePlayerListHtml();
}

function savePlayersLocally() {
  window.localStorage.setItem(PLAYER_LIST_STORAGE_KEY, JSON.stringify(State.playerList));
}

function populatePlayerListHtml() {
  const playerList = document.getElementById("playerList");
  while(playerList.firstChild) {
    playerList.removeChild(playerList.firstChild);
  }
  State.playerList.forEach((playerName, index) => {
    const newPlayerListItem = document.createElement("li");

    const button = document.createElement("button");
    button.setAttribute("index", index.toString());
    button.setAttribute("class", "button");
    button.innerHTML = "X";
    button.addEventListener("click", clearPlayer);
    newPlayerListItem.appendChild(button);

    newPlayerListItem.appendChild(document.createTextNode(playerName));

    playerList.appendChild(newPlayerListItem);
  });
}

function clearPlayer(event) {
  const index = event.srcElement.getAttribute("index");
  if (index === undefined || index >= State.playerList.length) {
    console.error("clearPlayer() called on element with bad index.")
    return;
  }

  State.playerList.splice(index, 1);
  savePlayersLocally();

  populatePlayerListHtml();
}

function clearPlayers(event) {
  event.preventDefault();

  State.playerList = [];
  savePlayersLocally();

  populatePlayerListHtml();
}

function addPlayer(event) {
  event.preventDefault();

  const playerName = document.getElementById("playerNameInput").value;
  if (playerName === "") {
    return;
  }

  State.playerList.push(playerName);
  savePlayersLocally();

  populatePlayerListHtml();
  document.getElementById("playerNameInput").value = "";
}

function canFactionBePicked(faction, selectedFactions) {
  if (faction.onlyPresentWith && faction.onlyPresentWith.length > 0) {
    const requiredFactions = faction.onlyPresentWith.map(presentWith => DATA.FACTIONS[presentWith] || console.error(`Invalid faction in onlyPresentWith for ${faction.name}: ${presentWith}`));
    if (requiredFactions.filter(requiredFaction => selectedFactions.indexOf(requiredFaction) === -1).length > 0) {
      return false;
    }
  }
  return true;
}

function randomizeFactions() {
  const availableFactions = Array.from(DATA.FACTION_LIST_BY_REACH);
  const humanPlayers = State.playerList.length;
  const useBot = document.getElementById("use-bot")

  if(humanPlayers == 1) {
    useBot.checked = true;
  }
  const numPlayers = (useBot.checked ? humanPlayers+1 : humanPlayers);
  if(numPlayers == 0) {
    throw "The game can't play itself!";
  }
  else if(numPlayers > availableFactions.length) {
    throw "Not enough available factions for this player count.";
  }

  const minReach = DATA.REACH_BY_PLAYER_COUNT[numPlayers];
  var currentReach = 0;
  const selectedFactions = [];

  function selectFaction(faction) {
    selectedFactions.push(faction);
    availableFactions.splice(availableFactions.indexOf(faction), 1);
    currentReach += faction.reach;
  }

  if (useBot.checked) {
    selectFaction(DATA.FACTIONS.MARQUISE_DE_CAT);
  }

  for(var i = 0; i < humanPlayers; i++) {
    // Calculate the minimum reach a faction can have to still be considered. We do this by summing the X biggest factions, where X is remaining players - 1, then
    //  determining the minimum reach that the last faction could have to still hit the target reach value.
    const biggestCombinationStartIndex = availableFactions.length - (numPlayers - 1 - selectedFactions.length);
    const minimumFactionReach = minReach - currentReach - availableFactions.slice(biggestCombinationStartIndex).map(faction => faction.reach).reduce((total, reach) => total += reach, 0);
    // Drop any factions from the list that would no longer allow us to hit the target reach
    while (availableFactions.length > 0 && availableFactions[0].reach < minimumFactionReach) {
      availableFactions.splice(0, 1);
    }
    if (availableFactions.length == 0) {
      throw "There is no combination of available factions which hits the target reach.";
    }
    // Pluck random faction
    const pickableFactions = availableFactions.filter(faction => canFactionBePicked(faction, selectedFactions));
    const pickableFactionIndex = Math.floor(Math.random() * pickableFactions.length);
    const faction = pickableFactions[pickableFactionIndex];
    selectFaction(faction);
  }

  return selectedFactions;
}

function randomizeClearings(gameMap) {
  const numOfEachClearingType = Math.ceil(gameMap.numClearings / DATA.CLEARING_TYPES_LIST.length);
  const availableClearings = [];
  for (var i = 0; i < numOfEachClearingType; i++) {
    DATA.CLEARING_TYPES_LIST.forEach(clearingType => availableClearings.push(clearingType));
  }
  return availableClearings
    .map(clearing => ({ sortIndex: Math.random(), value: clearing }))
    .sort((a, b) => a.sortIndex - b.sortIndex)
    .map(sortableClearing => sortableClearing.value)
    .splice(0, gameMap.numClearings);
}

function randomizeMap() {
  const map = DATA.MAP_LIST[Math.floor(Math.random() * DATA.MAP_LIST.length)];
  return {
    name: map.name,
    alt: map.alt,
    imageFileName: map.imageFileName,
    clearings: randomizeClearings(map)
  }
}

function randomizePlayerSetup() {
  const players = Array.from(State.playerList);
  const factions = randomizeFactions();
  const setup = [];
  if (document.getElementById("use-bot").checked) {
    setup.push(DATA.PLAYERS.MECHANICAL_MARQUISE);
    factions.splice(0,1);
  }
  // randomly assign factions to players
  return setup.concat(players.map(player => ({
      player: player,
      faction: factions.splice(Math.floor(Math.random() * factions.length), 1)[0],
    })));
}

function randomizeGame() {
  const playerSetups = randomizePlayerSetup();
  return {
    tableSize: playerSetups.length,
    seats: playerSetups.sort(() => Math.random() - 0.5),
    map: randomizeMap()
  }
}

function getSeatListHtml(seats) {
  const seatList = document.createElement("ul");
  seatList.setAttribute("class", "seat-list");

  seats.forEach(seat => {
    const seatListItem = document.createElement("li");
    const iconPath = `./icons/${seat.faction.iconFileName}`;
    const icon = iconPath ? `<img src=${iconPath} width="32" height="32">` : "";
    seatListItem.innerHTML = `<b>${seat.player}</b> will play <b>${seat.faction.name}</b> ${icon}`;
    seatList.appendChild(seatListItem);
  });
  return seatList;
}

function getMapImageOverlayHtml(map) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("mapWrapper");

  const backgroundMap = document.createElement("img");
  backgroundMap.classList.add("backgroundMap");
  backgroundMap.setAttribute("src", `./maps/${map.imageFileName}`);
  wrapper.appendChild(backgroundMap);

  // Build the individual clearing elements and capture alt text.
  const clearingAltTexts = [];
  map.clearings.forEach((clearing, index) => {
    const clearingIcon = document.createElement("img");
    clearingIcon.classList.add("clearingIcon");
    clearingIcon.classList.add(`${map.name}-pos${index}`);
    clearingIcon.setAttribute("src", `./icons/${clearing.iconFileName}`);
    const clearingAltText = `Position ${index}: ${clearing.name} clearing.`;
    clearingIcon.setAttribute("alt", clearingAltText);

    clearingAltTexts.push(clearingAltText);
    wrapper.appendChild(clearingIcon)
  })

  // Update the background with the finalized alt text.
  let mapAltText = `${map.alt}\nOverlaid with randomly ordered clearings.`;
  clearingAltTexts.forEach((clearingAlt) => {
    mapAltText += `\n${clearingAlt}`;
  });
  backgroundMap.setAttribute("alt", mapAltText);

  return wrapper;
}

function getMapHtml(map) {
  const mapHtml = document.createElement("div");
  const mapText = document.createElement("span");
  mapText.innerHTML = `The game will be played on the <b>${map.name}</b> map:`;
  mapHtml.appendChild(mapText);

  const overlayElement = getMapImageOverlayHtml(map);
  mapHtml.appendChild(overlayElement);

  return mapHtml;
}

function populateGameHtml() {
  const gameContainer = document.getElementById("output");
  while(gameContainer.firstChild) {
    gameContainer.removeChild(gameContainer.firstChild);
  }
  const game = State.game;
  const playersHeader = document.createElement("h2");
  playersHeader.appendChild(document.createTextNode("THE CONTENDERS"));
  gameContainer.appendChild(playersHeader);
  gameContainer.appendChild(getSeatListHtml(game.seats));
  const mapHeader = document.createElement("h2");
  mapHeader.appendChild(document.createTextNode("THE MAP"));
  gameContainer.appendChild(mapHeader);
  gameContainer.appendChild(getMapHtml(game.map));
}

function generateGame(event) {
  event.preventDefault();
  State.game = randomizeGame();
  populateGameHtml();
  console.log(JSON.stringify(State.game, null, 1));
}

loadState();
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
  State.playerList.forEach(playerName => {    
    const newPlayerListItem = document.createElement("li");
    newPlayerListItem.appendChild(document.createTextNode(playerName));
    playerList.appendChild(newPlayerListItem);
  });
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
  State.playerList.push(playerName);
  savePlayersLocally();

  populatePlayerListHtml();
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
  const numPlayers = State.playerList.length;
  const players = Array.from(State.playerList);
  const minReach = DATA.REACH_BY_PLAYER_COUNT[numPlayers];
  var currentReach = 0;
  const selectedFactions = [];

  if(numPlayers > availableFactions.length) {
    throw "Not enough available factions for this player count.";
  }

  for(var i = 0; i < numPlayers; i++) {
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
    selectedFactions.push(faction);
    const availableFactionsIndex = availableFactions.indexOf(faction);
    availableFactions.splice(availableFactionsIndex, 1);
    currentReach += faction.reach;
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
    clearings: randomizeClearings(map)
  }
}

function randomizePlayerSetup() {
  const players = Array.from(State.playerList);
  const factions = randomizeFactions();
  // randomly assign factions to players
  return players.map(player => ({
      player: player,
      faction: factions.splice(Math.floor(Math.random() * factions.length), 1)[0],
    }));
}

function randomizeGame() {
  const playerSetups = randomizePlayerSetup();
  return {
    tableSize: playerSetups.length,
    seats: playerSetups.sort(() => Math.random() - 0.5),
    map: randomizeMap()
  }
}

function getIconPath(faction) {
  var iconName = "";
  switch (faction) {
    case DATA.FACTIONS.MARQUISE_DE_CAT:
      iconName = "faction-marquise";
      break;
    case DATA.FACTIONS.UNDERGROUND_DUCHY:
      iconName = "faction-duchy";
      break;
    case DATA.FACTIONS.EYRIE_DYNASTIES:
      iconName = "faction-eyrie";
      break;
    case DATA.FACTIONS.VAGABOND_1:
      iconName = "faction-vagabond";
      break;
    case DATA.FACTIONS.RIVERFOLK_COMPANY:
      iconName = "faction-riverfolk";
      break;
    case DATA.FACTIONS.WOODLAND_ALLIANCE:
      iconName = "faction-woodland";
      break;
    case DATA.FACTIONS.CORVID_CONSPIRACY:
      iconName = "faction-corvid";
      break;
    case DATA.FACTIONS.VAGABOND_2:
      iconName = "faction-vagabond-2";
      break;
    case DATA.FACTIONS.LIZARD_CULTs:
      iconName = "faction-cult";
      break;
  }

  return iconName ? `./icons/${iconName}.png` : "";
}

function getSeatListHtml(seats) {
  const seatList = document.createElement("ul");
  seatList.setAttribute("class", "seat-list");

  seats.forEach(seat => {
    const seatListItem = document.createElement("li");
    const iconPath = getIconPath(seat.faction);
    console.log(iconPath);
    const icon = iconPath ? `<img src=${iconPath} width="32" height="32">` : "";
    console.log(icon);
    seatListItem.innerHTML = `<b>${seat.player}</b> will play <b>${seat.faction.name}</b> ${icon}`;
    seatList.appendChild(seatListItem);
  });
  return seatList;
}

function getMapHtml(map) {
  const mapHtml = document.createElement("div");
  const mapText = document.createElement("span");
  mapText.innerHTML = `The game will be played on the <b>${map.name}</b> map, with the following clearings in order:`;
  mapHtml.appendChild(mapText);
  const clearingList = document.createElement("ol");
  map.clearings.forEach(clearing => {
    const clearingItem = document.createElement("li");
    clearingItem.appendChild(document.createTextNode(clearing.name));
    clearingItem.style.color = clearing.color;
    clearingList.appendChild(clearingItem);
  });
  mapHtml.append(clearingList);
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
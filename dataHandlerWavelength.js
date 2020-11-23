'use strict';

let csv = require("csvtojson");

let wlDeck = "wavelength-";
let languages = ["en", "se"];
/* https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Store data in an object to keep the global namespace clean
function Data() {
  this.data = {};
  this.rooms = {};
}


/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

/*
  Function to load initial data from CSV files into the object
*/
Data.prototype.initializeTable = function (table) {
  csv({checkType: true})
    .fromFile("./data/" + table + ".csv")
    .then((jsonObj) => {
      this.data[table] = jsonObj;
    });
};

Data.prototype.initializeData = function() {
  console.log("Starting to build data tables");
  for (let i in languages) {
    this.initializeTable(wlDeck + languages[i]);
  }
}

Data.prototype.getUILabels = function (roomId) {
  let lang = this.rooms[roomId].lang;
  var ui = require("./data/wavelength-" + lang + ".json");
  return ui;
};

Data.prototype.createRoom = function(roomId, lang="en") {
  let room = {};
  room.players = [];
  room.lang = lang;
  room.deck = this.createDeck(lang);
  room.playedMissions = [];
  room.points = {team1: 0, team2: 0};
  this.rooms[roomId] = room;
}

Data.prototype.createDeck = function(lang) {
  let deck = this.data[wlDeck + lang];
  return shuffle(deck);
}

Data.prototype.joinGame = function (roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    if (room.players.map(d => d.playerId).includes(playerId)) {
      return true;
    }
    else if (room.players.length <= room.playerCount) {
      room.players.push({playerId: playerId, hand: [], color: "gray", played: []});
      return true;
    } 
  }
  return false;
}

Data.prototype.getInfo = function (id) {
  let room = this.rooms[id]
  if (typeof room !== 'undefined') {
    return {playerCount: room.playerCount, 
            cardsRemaining: room.deck.length,
            points: room.points}
  }
  else return {};
}

Data.prototype.updatePoints = function (roomId, team, points) {
  let room = this.rooms[roomId]
  if (typeof room !== 'undefined') {
    room.points[team] += points;
    return room.points;
  }
  else return {};
}

Data.prototype.getNewMission = function (roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let mission = {card: room.deck.pop(), 
                   target: Math.random(), 
                   points: room.points };
    room.playedMissions.push(mission);
    return mission;
  }
}

Data.prototype.getCurrentMission = function (roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    if (room.playedMissions.length < 1) {
      return this.getNewMission(roomId);
    }
    else {
      return room.playedMissions[room.playedMissions.length - 1];
    }
  }
}

module.exports = Data;




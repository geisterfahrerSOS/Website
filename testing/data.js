/*function fetchData() {
  var xlsx = require("node-xlsx");
  var fs = require("fs");
  var obj = xlsx.parse("../Schieß-Testdaten/Individual Men G1.xls"); // parses a file
  var rows = [];
  var writeStr = "";

  //looping through all sheets
  for (var i = 0; i < obj.length; i++) {
    var sheet = obj[i];
    //loop through all rows in the sheet
    for (var j = 0; j < sheet["data"].length; j++) {
      //add the row to the rows array
      rows.push(sheet["data"][j]);
    }
  }

  //creates the csv string to write it to a file
  for (var i = 0; i < rows.length; i++) {
    writeStr += rows[i].join(",") + "\n";
  }

  //writes to a file, but you will presumably send the csv as a
  //response instead
  fs.writeFile("../Test Individual Men G1.csv", writeStr, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("test.csv was saved in the current directory!");
  });
}

fetchData();
*/

class CEvent {
  constructor(id, liga, ort, nation, hoehe, start, stop, races = []) {
    this.id = id;
    this.liga = liga;
    this.ort = ort;
    this.nation = nation;
    this.hohe = hoehe;
    this.start = new Date(start);
    this.stop = new Date(stop);
    this.races = races;
  }
  addRace(race) {
    this.races.push(race);
  }
}

class CAthlete {
  constructor(id, name, nationality) {
    this.id = id;
    this.name = name;
    this.nationality = nationality;
    this.events = [];
    this.races = [];
  }
  addEvent(event) {
    this.events.push(event);
  }
  addRace(race) {
    this.races.push(race);
  }
}

class CRace {
  constructor(id, Typ, Geschlecht=-1, length, startTime = '2014-01-01T23:28:56.782Z', wetter, ergebnis = {}) {
    this.id = id;
    this.typ = Typ;
    this.geschlecht = Geschlecht;
    this.length = length;
    this.startTime = new Date(startTime);
    this.wetter = [];
    this.wetter.push(wetter);
    this.ergebnis = {};
  }
  addErgebnis(data) {
    this.ergebnis = {
      time: this.startTime,
      daten: data,
    }
  }
  addWetter(wetter) {
    this.wetter.push(wetter);
  }
}

class CWetter {
  constructor(Ort, Datum, Temperatur, Feuchtigkeit, Schneetemperatur, Windstaerke, Windrichtung, bemerkung) {
    this.standort = Ort;
    this.datum = Datum;
    this.temp = Temperatur;
    this.feuchte = Feuchtigkeit; 
    this.schneetemp = Schneetemperatur;
    this.windstaerke = Windstaerke;
    this.windrichtung = Windrichtung;
    this.bemerkung = bemerkung;
  }
}


let Antholz = new CEvent(123, 'IBU', 'Antholz', 'ITA', 1300, '2021-01-21', '2021-01-24');
Antholz.addRace(new CRace(23, 'Massenstart', 'Maennlich', 10, '2021-01-22T10:30:00Z', new CWetter('Antholz', '2021-01-22T10:30:00Z', 2, 44, -3, 5, 109, "Sonniges Wetter")));

let Doll = new CAthlete(20, 'DOLL Benedikt', 'GER');
Doll.addEvent(Antholz);
Doll.addRace(Antholz.races.find(item => item.typ == 23));
console.log(Doll);

const fs = require('fs');
 
let data = JSON.stringify(Doll);
fs.writeFileSync('student-2.json', data);

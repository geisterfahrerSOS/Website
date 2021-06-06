//////////////////////////drop down liste mit Namen füllen
let athletes = [];
athletesRequest();
//////////////////////////////
function submit(value) {
  document.querySelectorAll(".shooting").forEach((el) => el.remove());
  if (athletes != null) {
    let athlete = athletes[athletes.findIndex((item) => item.id == value)];
    for (let i = athlete.shots.length - 1; i >= 0; i--) {
      addShootingResult(athlete.shots[i]);
    }
  } else {
    console.log("There was a problem... No athletes object found!");
  }
}
//setInterval(athletesRequest, 5000);
function athletesRequest() {
  const Http = new XMLHttpRequest();
  const url = "http://localhost/showAthletes";
  Http.open("GET", url);
  Http.send();

  Http.onreadystatechange = (e) => {
    athletes = JSON.parse(Http.responseText);
    let dropDown = document.querySelectorAll("select")[0];
    dropDown.innerHTML =
      "<option value='noValue'>Athleten auswählen...</option>";
    for (let count of athletes) {
      let option = document.createElement("option");
      option.value = count.id;
      option.innerHTML = `${count.firstName} ${count.lastName}`;
      dropDown.appendChild(option);
    }
  };
}

function addShootingResult(shooting) {
  //Schussergebnis
  let shootingNode = document.createElement("div");
  shootingNode.innerHTML = `<div class="shooting">
  <div class="datumLabel">
    Datum
  </div>
  <div class="artLabel">
    Schussart
  </div>
  <div class="zeitLabel">
    Zeit
  </div>
  <div class="trefferQuoteLabel">
    Trefferquote
  </div>
  <div class="shotLabel">
    Schuss Grafik
  </div>
  <div class="zeitAufteilungLabel">
    Zeitaufteilung
  </div>
  <div class="datum">
    <div class="uhrzeit">
      16:45
    </div>
    <div class="datumKurz">
      23.07.2021
    </div>
  </div>
  <div class="art"></div>
  <div class="zeitWrapper">
    <div class="zeit"">
      29.4 s
    </div>
  </div>
  <div class="trefferQuote">
    80 %
  </div>
  <div class="shotsWrapper">
    <div class="shot">
      <div class="dot"></div>
      <div class="time"></div>
    </div>
    <div class="shot">
      <div class="dot"></div>
      <div class="time"></div>
    </div>
    <div class="shot">
      <div class="dot"></div>
      <div class="time"></div>
    </div>
    <div class="shot">
      <div class="dot"></div>
      <div class="time"></div>
    </div>
    <div class="shot">
      <div class="dot"></div>
      <div class="time"></div>
    </div>
  </div>
  <div class="canvasWrapper">
    <canvas
      class="myCanvas"
      width="300px"
      height="40px"
    ></canvas>
  </div>
</div>`;
console.log(shootingNode);
console.log(shooting);
//////////////////////////////////////////////////////////////////////////
  let output = "";
  for (let count of shooting.result) {
    //Text Schussanzeige
    if (count.state != "0 ") {
      output += " " + count.state;
    } else {
      output += " X";
    }
  }
  ////////////////////////////////////Bestimmung der Schussreihenfolge
  let shotDir = -1; //-1 rechts nach links || 1 links nach rechts
  if (
    shooting.result.filter((item) => item != "0").splice(-1)[0].state >=
    shooting.result.filter((item) => item != "0")[0].state
  ) {
    shotDir = 1;
    output += "<br>&rarr;"; //rechts
  } else {
    output += "<br>&larr;"; //links
  }
  //shootingNode.querySelectorAll(".result")[0].innerHTML = output;//früherer Output bei Schussart siehe Git
  ////////////////////////////////////////
  shootingNode
    .querySelectorAll(".shot")
    .forEach((item) => (item.childNodes[1].style.backgroundColor = "#000000")); //Alle werden auf Schwarz gestellt
  for (let i = 0; i < 5; i++) {
    shootingNode.querySelectorAll(".shot")[i].childNodes[3].innerHTML = "";
  }
  console.log(shooting);
  for (let i = 0; i < shooting.result.length; i++) {
    if (shooting.result[i].state == "0") {
      console.log("fehler: " + shooting.result[i].time);
    } else {
      console.log("treffer: " + shooting.result[i].time);
      let div =
        shootingNode.querySelectorAll(".shot")[(shooting.result[i].state - 1) % 5];
        console.log(div);
        console.log(shooting.result[i].state - 1);
      div.childNodes[1].style.backgroundColor = "#ffffff";
      div.childNodes[3].innerHTML = shooting.result[i].time;
    }
  }
  //////////////////////////////////////////Felder werden aufgefüllt
  shootingNode.querySelectorAll(".art")[0].innerHTML = shooting.art;
  shootingNode.querySelectorAll(".zeit")[0].innerHTML = shooting.result[4].time;
  shootingNode.querySelectorAll(".trefferQuote")[0].innerHTML =
    shooting.accuracy +
    " %";
  let date = new Date(shooting.date);
  console.log(date);
  shootingNode.querySelectorAll(".uhrzeit")[0].innerHTML =
    date.getHours() + ":" + date.getMinutes();
  shootingNode.querySelectorAll(".datumKurz")[0].innerHTML =
    date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
  ////////////////////////////////////////////////////canvas
  let ground = 60; //referenz für einen vollen Balken
  let canvas = shootingNode.querySelectorAll(".myCanvas")[0];
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(130,130,130)";
  ctx.fillRect(0, 0, (canvas.width * shooting.result[4].time) / ground, canvas.height);
  ctx.fillStyle = shooting.result[0].state == 0 ? "rgb(255,0,0)" : "rgb(0,255,0)";
  ctx.fillRect(
    (canvas.width * shooting.result[0].time) / ground - 2,
    0,
    2,
    canvas.height
  );
  for (let i = 1; i < 5; i++) {
    ctx.fillStyle = shooting.result[i].state == 0 ? "rgb(255,0,0)" : "rgb(0,255,0)";
    ctx.fillRect(
      (canvas.width * shooting.result[i].time) / ground - 2,
      0,
      2,
      canvas.height
    );
  }
  document.querySelectorAll(".mainWrapper")[0].appendChild(shootingNode);
}

let athletes = [];
function submit(value) {
  if (athletes != null) {
    let athlete = athletes[athletes.findIndex((item) => item.id == value)];
    let shooting = athlete.shots.slice(-1)[0].result;

    let output = "";
    for (let count of shooting) {
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
      shooting.filter((item) => item != "0").splice(-1)[0].state >=
      shooting.filter((item) => item != "0")[0].state
    ) {
      shotDir = 1;
      output += "<br>&rarr;"; //rechts
    } else {
      output += "<br>&larr;"; //links
    }
    document.querySelectorAll(".result")[0].innerHTML = output;
    ////////////////////////////////////////
    document
      .querySelectorAll(".shot")
      .forEach(
        (item) => (item.childNodes[1].style.backgroundColor = "#000000")
      ); //Alle werden auf Schwarz gestellt
    for (let i = 0; i < 5; i++) {
      document.querySelectorAll(".shot")[i].childNodes[3].innerHTML = "";
    }
    console.log(shooting);
    for (let i = 0; i < shooting.length; i++) {
      if (shooting[i].state == "0") {
        console.log("fehler: " + shooting[i].time);
      } else {
        console.log("treffer: " + shooting[i].time);
        let div =
          document.querySelectorAll(".shot")[(shooting[i].state - 1) % 5];
        div.childNodes[1].style.backgroundColor = "#ffffff";
        div.childNodes[3].innerHTML = shooting[i].time;
      }
    }
    //////////////////////////////////////////Felder werden aufgefüllt
    document.querySelectorAll(".schussArt")[0].innerHTML =
      athlete.shots.slice(-1)[0].art; //Schussart wird angezeigt
    document.querySelectorAll(".zeit")[0].innerHTML =
      athlete.shots.slice(-1)[0].result[4].time;
    document.querySelectorAll(".trefferQuote")[0].innerHTML =
      (5 -
        athlete.shots.slice(-1)[0].result.filter((item) => item.state == "0")
          .length) *
        20 +
      " %";
    let date = new Date(athlete.shots.slice(-1)[0].date);
    console.log(date);
    document.querySelectorAll(".uhrzeit")[0].innerHTML =
      date.getHours() + ":" + date.getMinutes();
    document.querySelectorAll(".datumKurz")[0].innerHTML =
      date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
    ////////////////////////////////////////////////////
    let ground = 60;
    let canvas = document.querySelectorAll(".myCanvas")[0];
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(130,130,130)";
    ctx.fillRect(
      0,
      0,
      (canvas.width * shooting[4].time) / ground,
      canvas.height
    );
    ctx.fillStyle = shooting[0].state == 0 ? "rgb(255,0,0)" : "rgb(0,255,0)";
    ctx.fillRect(
      (canvas.width * shooting[0].time) / ground -2,
      0,
      2,
      canvas.height
    );
    for (let i = 1; i < 5; i++) {
      ctx.fillStyle = shooting[i].state == 0 ? "rgb(255,0,0)" : "rgb(0,255,0)";
      ctx.fillRect(
        (canvas.width * shooting[i].time) / ground -2,
        0,
        2,
        canvas.height
      );
    }
  } else {
    console.log("There was a problem...");
  }
}

//////////////////////////drop down liste mit Namen füllen
const Http = new XMLHttpRequest();
const url = "http://localhost/showAthletes";
Http.open("GET", url);
Http.send();

Http.onreadystatechange = (e) => {
  athletes = JSON.parse(Http.responseText);
  let dropDown = document.querySelectorAll("select")[0];
  dropDown.innerHTML = "<option value='noValue'>Athleten auswählen...</option>";
  for (let count of athletes) {
    let option = document.createElement("option");
    option.value = count.id;
    option.innerHTML = `${count.firstName} ${count.lastName}`;
    dropDown.appendChild(option);
  }
};

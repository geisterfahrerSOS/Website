//mehrere Daten!!!!!!!!!!!!
let created = false;
      let myChart;
      let athletes = [];
      let datenreihen = [
        "Trefferquote",
        "Schusszeit",
        "1. Schuss",
        "2. Schuss",
        "3. Schuss",
        "4. Schuss",
        "5. Schuss",
      ];
      athletesRequest();
      function athletesRequest() {
        //machen einen Http request um die dropdowns und checklisten zu füllen
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
          // dropDown = document.querySelectorAll("select")[1];
          // dropDown.innerHTML =
          //   "<option value='noValue'>Datenreihe auswählen...</option>";
          // for (let count of datenreihen) {
          //   let option = document.createElement("option");
          //   console.log(count);
          //   option.value = count;
          //   option.innerHTML = count;
          //   dropDown.appendChild(option);
          // }
          let checkBox = document.querySelectorAll(".checkBoxes")[0];
          checkBox.innerHTML = ``;
          for (let count of datenreihen) {
            let input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            input.setAttribute("onChange", "submit()");
            input.setAttribute("value", count);
            input.setAttribute("id", count);
            checkBox.appendChild(input);
            checkBox.innerHTML += count + "&nbsp;&nbsp;";
          }
        };
      }
      function submit() {
        let value = document.querySelectorAll("select")[0].value;
        let checkBox = document.querySelectorAll(".checkBoxes > input");
        console.log(checkBox);
        let dataValue = [];
        for (let count of checkBox) {
          if (count.checked) {
            dataValue.push(count.value);
          }
        }
        console.log(dataValue);
        if (athletes != null) {
          makeData(
            athletes[athletes.findIndex((item) => item.id == value)],
            dataValue
          );
        } else {
          console.log("There was a problem... No athletes object found!");
        }
      }
      let data;
      function leftFillNum(num, targetLength) {
        return num.toString().padStart(targetLength, 0);
      }
      function makeData(athlete, dataValues) {
        data = { labels: [], datasets: [] };
        data.labels = athlete.shots.map((item) => {
          let date = new Date(item.date);
          return (
            leftFillNum(date.getDate() + 1, 2) +
            "/" +
            leftFillNum(date.getMonth(), 2) +
            "/" +
            leftFillNum(date.getFullYear(), 2) +
            "  " +
            leftFillNum(date.getHours(), 2) +
            ":" +
            leftFillNum(date.getMinutes(), 2)
          );
        });
        for (let count of dataValues) {
          switch (count) {
            case "Trefferquote":
              data.datasets.push({
                label: count,
                data: athlete.shots.map((item) => item.accuracy),
                backgroundColor: ["rgba(255, 99, 132, 0.2)"],
                borderColor: ["rgba(255, 99, 132, 1)"],
                borderWidth: 2,
                yAxisID: "yAxisB",
              });
              break;
            case "Schusszeit":
              data.datasets.push({
                label: count,
                data: athlete.shots.map((item) => item.result[4].time),
                backgroundColor: ["rgba(226, 160, 255, 0.2)"],
                borderColor: ["rgba(226, 160, 255, 1)"],
                borderWidth: 2,
                yAxisID: "yAxisA",
              });
              break;
            case "1. Schuss":
              data.datasets.push({
                label: count,
                data: athlete.shots.map((item) => item.result[0].time),
                backgroundColor: ["rgba(67, 97, 238, 0.2)"],
                borderColor: ["rgba(67, 97, 238, 1)"],
                borderWidth: 2,
                yAxisID: "yAxisA",
              });
              break;
            case "2. Schuss":
              data.datasets.push({
                label: count,
                data: athlete.shots.map((item) => item.result[1].time),
                backgroundColor: ["rgba(227, 217, 133, 0.2)"],
                borderColor: ["rgba(227, 217, 133, 1)"],
                borderWidth: 2,
                yAxisID: "yAxisA",
              });
              break;
            case "3. Schuss":
              data.datasets.push({
                label: count,
                data: athlete.shots.map((item) => item.result[2].time),
                backgroundColor: ["rgba(229, 122, 68, 0.2)"],
                borderColor: ["rgba(229, 122, 68, 1)"],
                borderWidth: 2,
                yAxisID: "yAxisA",
              });
              break;
            case "4. Schuss":
              data.datasets.push({
                label: count,
                data: athlete.shots.map((item) => item.result[3].time),
                backgroundColor: ["rgba(112, 171, 175, 0.2)"],
                borderColor: ["rgba(112, 171, 175, 1)"],
                borderWidth: 2,
                yAxisID: "yAxisA",
              });
              break;
            case "5. Schuss":
              data.datasets.push({
                label: count,
                data: athlete.shots.map((item) => item.result[4].time),
                backgroundColor: ["rgba(86, 227, 159, 0.2)"],
                borderColor: ["rgba(86, 227, 159, 1)"],
                borderWidth: 2,
                yAxisID: "yAxisA",
              });
              break;
            default:
              console.log("Fehler bei Datenreihen");
              break;
          }
        }
        console.log(data.datasets);
        if (created) {
          myChart.destroy();
        }
        let ctx = document.getElementById("myChart").getContext("2d");
        let options = {
          type: "line",
          data: {
            labels: data.labels,
            datasets: data.datasets,
          },
          options: {
            line: {
              tension: 16,
            },
            responsive: false,
            scales: {
              yAxisA: {
                type: "linear",
                position: "left",
                ticks: {
                  callback: function (value, index, values) {
                    return value + " s";
                  },

                },
              },
              yAxisB: {
                type: "linear",
                position: "right",
                ticks: {
                  beginAtZero: true,
                  callback: function (value, index, values) {
                    return value + " %";
                  },
                },
              },
            },
          },
        };
        console.log(options);
        myChart = new Chart(ctx, options);
        created = true;
      }

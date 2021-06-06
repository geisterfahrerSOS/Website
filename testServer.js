const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const host = "192.168.1.216";
const port = 80;
let result = "";
//fs.sync in Zukunft weglassen
http
  .createServer(function (req, res) {
    const pathname = url.parse(req.url, true).pathname;
    const queryObject = url.parse(req.url, true).query;
    switch (pathname.slice(1, pathname.length)) {
      case "addAthlete": //?lastName&firstName&age
        {
          if (!fs.existsSync("./athletes.json")) {
            fs.writeFileSync("./athletes.json", "[]");
            console.log("creating file");
          }
          let athleteArray = JSON.parse(
            fs.readFileSync("./athletes.json", { encoding: "utf-8" })
          );
          let id = 0;
          if (athleteArray.length > 0) {
            id = Number(athleteArray.slice(-1)[0].id) + 1;
          }
          let athlete = {
            id: id,
            lastName: queryObject.lastName,
            firstName: queryObject.firstName,
            age: queryObject.age,
            shots: [],
            notes: queryObject.notes,
          };
          athleteArray.push(athlete);
          fs.writeFileSync("./athletes.json", JSON.stringify(athleteArray));
        }
        break;
      case "addShooting": //?mode&value(athlete)&result
        {
          if (!fs.existsSync("./athletes.json")) {
            fs.writeFileSync("./athletes.json", "[]");
            console.log("creating file");
          }
          let athleteArray = JSON.parse(
            fs.readFileSync("./athletes.json", { encoding: "utf-8" })
          );
          let index = -1;
          switch (queryObject.mode) {
            case "id":
              index = athleteArray.findIndex(
                (item) => item.id == queryObject.value
              );
              break;
            case "lastName":
              index = athleteArray.findIndex(
                (item) => item.lastName == queryObject.value
              );
              break;
            default:
              index = athleteArray.findIndex(
                (item) => item.id == queryObject.value
              );
          }
          console.log(index);
          let current = new Date();
          let id = 0;
          if (athleteArray[index].shots.length > 0) {
            id = Number(athleteArray[index].shots.slice(-1)[0].id) + 1;
          }
          console.log(queryObject.result);
          let shooting = queryObject.result.split(",");
          let shootingResult = [];
          for (let i = 0; i < shooting.length; i += 2) {
            shootingResult.push({ state: shooting[i], time: shooting[i + 1] });
          }
          let accuracy = (5 - shootingResult.filter((item) => item.state == "0").length) * 20;
          console.log(shootingResult);
          athleteArray[index].shots.push({
            id: id,
            date: current,
            art: queryObject.art,
            result: shootingResult,
            accuracy: accuracy,
            notes: queryObject.notes,
          });
          //console.log(athleteArray);
          fs.writeFileSync("./athletes.json", JSON.stringify(athleteArray));
          result = "added new shooting...";
        }
        break;
      case "deleteAthlete": //?mode(id||lastName)&value
        {
          if (!fs.existsSync("./athletes.json")) {
            fs.writeFileSync("./athletes.json", "[]");
            console.log("creating file");
          }
          let athleteArray = JSON.parse(
            fs.readFileSync("./athletes.json", { encoding: "utf-8" })
          );
          switch (queryObject.mode) {
            case "id":
              {
                athleteArray.splice(
                  athleteArray.findIndex(
                    (item) => item.id == queryObject.value
                  ),
                  1
                );
              }
              break;
            case "lastName":
              {
                athleteArray.splice(
                  athleteArray.findIndex(
                    (item) => item.lastName == queryObject.value
                  ),
                  1
                );
              }
              break;
            default: {
              athleteArray.splice(
                athleteArray.findIndex((item) => item.id == queryObject.id),
                1
              );
            }
          }
          fs.writeFileSync("./athletes.json", JSON.stringify(athleteArray));
        }
        break;
      case "deleteShooting": //?id(athlete)&idShot
        {
          if (!fs.existsSync("./athletes.json")) {
            fs.writeFileSync("./athletes.json", "[]");
            console.log("creating file");
          }
          let athleteArray = JSON.parse(
            fs.readFileSync("./athletes.json", { encoding: "utf-8" })
          );
          let athlete =
            athleteArray[
              athleteArray.findIndex((item) => item.id == queryObject.id)
            ];
          athlete.shots.splice(
            athlete.shots.findIndex((item) => item.id == queryObject.idShot)
          );
          res.setHeader("Content-type", "text/plain");
          res.end(
            `${athlete.firstName} ${athlete.lastName} Schuss (id: ${queryObject.idShot}) wurde gelöscht`
          );
        }
        break;
      case "showAthletes": //?mode&value
        {
          if (!fs.existsSync("./athletes.json")) {
            fs.writeFileSync("./athletes.json", "[]");
            console.log("creating file");
          }
          console.log("Showing Athletes...");
          res.setHeader("Content-type", "application/json");
          let athleteArray = JSON.parse(
            fs.readFileSync("./athletes.json", { encoding: "utf-8" })
          );
          if (queryObject.value != null) {
            switch (queryObject.mode) {
              case "id":
                {
                  result = JSON.stringify(
                    athleteArray[
                      athleteArray.findIndex(
                        (item) => item.id == queryObject.value
                      )
                    ],
                    null,
                    2
                  );
                }
                break;
              case "lastName":
                {
                  result = JSON.stringify(
                    athleteArray[
                      athleteArray.findIndex(
                        (item) => item.lastName == queryObject.value
                      )
                    ],
                    null,
                    2
                  );
                }
                break;
              default: {
                result = JSON.stringify(
                  athleteArray[
                    athleteArray.findIndex(
                      (item) => item.id == queryObject.value
                    )
                  ],
                  null,
                  2
                );
              }
            }
          } else {
            result = JSON.stringify(athleteArray, null, 2);
          }
        }
        break;
      case "favicon.ico":
        break;
      case "getData":
        {
          if (!fs.existsSync("./athletes.json")) {
            fs.writeFileSync("./athletes.json", "[]");
            console.log("creating file");
          }
          let athleteArray = JSON.parse(
            fs.readFileSync("./athletes.json", { encoding: "utf-8" })
          );
          console.log(athleteArray[queryObject.adress]);
        }
        break;
      case "setAction":
        {
          //mode&value&action
          if (!fs.existsSync("./athletes.json")) {
            fs.writeFileSync("./athletes.json", "[]");
            console.log("creating file");
          }
          let athleteArray = JSON.parse(
            fs.readFileSync("./athletes.json", { encoding: "utf-8" })
          );
          let index = -1;
          switch (queryObject.mode) {
            case "id":
              index = athleteArray.findIndex(
                (item) => item.id == queryObject.value
              );
              break;
            case "lastName":
              index = athleteArray.findIndex(
                (item) => item.lastName == queryObject.value
              );
              console.log(athleteArray);
              break;
            default:
              index = athleteArray.findIndex(
                (item) => item.id == queryObject.value
              );
          }
          if (!fs.existsSync("./shootingLog.json")) {
            fs.writeFileSync("./shootingLog.json", "[]");
            console.log("creating file");
          }
          let shootingLog = JSON.parse(fs.readFileSync("./shootingLog.json"));
          let idIndex = 0;
          if (shootingLog.length > 0) {
            idIndex = shootingLog.slice(-1)[0].id + 1;
          }
          if (queryObject.action == "start") {
            shootingLog.push({
              id: idIndex,
              athleteId: index,
              art: queryObject.art,
              date: new Date(),
              action: queryObject.action,
            });
          } else {
            shootingLog.push({
              id: idIndex,
              athleteId: index,
              date: new Date(),
              action: queryObject.action,
            });
          }
          fs.writeFileSync("./shootingLog.json", JSON.stringify(shootingLog));
          result = `Action: "${queryObject.action}" has been sent to the controller`;
        }
        break;
      case "getAction":
        {
          if (fs.existsSync("./shootingLog.json")) {
            let log = JSON.parse(fs.readFileSync("./shootingLog.json")).slice(
              -1
            )[0];
            console.log(log);
            console.log(queryObject.mode);
            if (queryObject.mode != null) {
              switch (queryObject.mode) {
                case "action":
                  {
                    result = log.action;
                  }
                  break;
                case "athleteId":
                  {
                    result = String(log.athleteId);
                  }
                  break;
                case "date":
                  {
                    result = log.date;
                  }
                  break;
                case "id":
                  {
                    result = String(log.id);
                  }
                  break;
                case "art":
                  {
                    result = log.art;
                  }
                  break;
                default:
                  result = "wrong mode selected...";
                  console.log("wrong mode selected...");
              }
            } else {
              result = JSON.stringify(log, null, 2);
            }
          } else {
            result = "no such file exists";
          }
        }
        break;
      case "showAction":
        {
          if (fs.existsSync("./shootingLog.json")) {
            let log = JSON.parse(fs.readFileSync("./shootingLog.json"));
            console.log(log);
            if (queryObject.id != null) {
              result = JSON.stringify(
                log.filter((item) => item.athleteId == queryObject.id),
                null,
                2
              );
            } else {
              result = JSON.stringify(log, null, 2);
            }
          } else {
            result = "no such file exists";
            console.log("no such file exists");
          }
        }
        break;
      default:
        console.log("Command not found");
        result = `Command "${pathname.slice(1, pathname.length)}" not found`;
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-type", "text/plain");
    res.end(result);
    result = "";
  })
  .listen(port);

console.log(`Server started at http://localhost:${port}`);

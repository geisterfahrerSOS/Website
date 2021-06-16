function submit(value) {
    let name = document.querySelectorAll("#name")[0].value;
    let message = document.querySelectorAll("#nachricht")[0].value;
  const Http = new XMLHttpRequest();
  const url = "http://localhost/sendMessage?name="+name+"&message="+message;
  Http.open("GET", url);
  Http.send();

  Http.onreadystatechange = (e) => {
    athletes = JSON.parse(Http.responseText);
  };
}

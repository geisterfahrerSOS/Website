function submit(value) {
  document.querySelectorAll(".output")[0].innerHTML = "";
  document.querySelectorAll(".output")[0].classList.add("loader");
    let name = document.querySelectorAll("#name")[0].value;
    let message = document.querySelectorAll("#nachricht")[0].value;
  const Http = new XMLHttpRequest();
  const url = "http://localhost/sendMessage?name="+name+"&message="+message;
  Http.open("GET", url);
  Http.send();

  Http.onreadystatechange = (e) => {
    if(e.currentTarget.status == 200) {
      document.querySelectorAll(".output")[0].classList.remove("loader");
      document.querySelectorAll(".output")[0].innerHTML = "Daten erfolgreich an den Server übermittelt";
    }
    else 
    {
      document.querySelectorAll(".output")[0].classList.remove("loader");
      document.querySelectorAll(".output")[0].innerHTML = "Fehler beim Senden der Nachricht an den Server";
    }
  };
}

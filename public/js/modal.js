// Pega o modal
var modal = document.getElementById("myModal");

// Pega a imagem e a insere dentro do modal - usa o texto "alt" como legenda
var img = document.getElementById("astronauta");
var modalImg = document.getElementById("modal-astronauta");
var captionText = document.getElementById("caption");
img.onclick = function(){
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
/**
 * Modal de informações.
 * Todo o conteúdo é preenchido dinamicamente a partir do stand
 * clicado — nada fica fixo no HTML.
 */
function abrirModal(obj) {

  if (obj.tipo === "objeto") {
    abrirImagem(obj.imagem);
    return; 
  }

  const iconeEl = document.getElementById("modal-icone");
  const imgEl = document.getElementById("modal-img");

  document.getElementById("modal-categoria").textContent = obj.categoria;
  document.getElementById("modal-titulo").textContent = obj.nome;
  document.getElementById("modal-descricao").textContent = obj.descricao;
  document.getElementById("modal-curiosidade-texto").textContent = obj.curiosidade;

  const card = document.getElementById("modal-card");
  card.style.setProperty("--cor-categoria", obj.cor || "#b58b2d");

  if (obj.icone) {
    iconeEl.textContent = obj.icone;
    iconeEl.style.display = "block";
    imgEl.style.display = "none";
  } else if (obj.imagem) {
    imgEl.src = obj.imagem;
    imgEl.style.display = "block";
    iconeEl.style.display = "none";
  }

  document.getElementById("modal-overlay").classList.remove("oculto");
}

function fecharModal() {
    document.getElementById("modal-overlay").classList.add("oculto");
  }

function abrirImagem(src){
    const overlay = document.getElementById("imagem-overlay");
    const img = document.getElementById("imagem-full");

    img.src = src;
    overlay.classList.remove("oculto");
}

function fecharImagem(){
    document.getElementById("imagem-overlay").classList.add("oculto");
}

document.getElementById("imagem-overlay").addEventListener("click", fecharImagem);
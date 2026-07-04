/**
 * Modal de informações.
 * Todo o conteúdo é preenchido dinamicamente a partir do stand
 * clicado — nada fica fixo no HTML.
 */
function abrirModal(stand) {
  document.getElementById("modal-icone").textContent = stand.icone;
  document.getElementById("modal-categoria").textContent = stand.categoria;
  document.getElementById("modal-titulo").textContent = stand.nome;
  document.getElementById("modal-descricao").textContent = stand.descricao;
  document.getElementById("modal-curiosidade-texto").textContent = stand.curiosidade;

  const card = document.getElementById("modal-card");
  card.style.setProperty("--cor-categoria", stand.cor);

  document.getElementById("modal-overlay").classList.remove("oculto");
}

function fecharModal() {
  document.getElementById("modal-overlay").classList.add("oculto");
}

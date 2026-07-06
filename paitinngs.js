/**
 * paintings.js
 * Renderiza a galeria de quadros do museu.
 */

const GALERIA = {
    x: 2580,
    y: 445,
    width: 680,
    height: 100
};
const QUADROS = [

    { x:2580, y:250, imagem:"assets/quadro1.webp", titulo:"Independência ou Morte - Autor", descricao:"Criado para a indenpendencia", curiosidade:"Foi pintada com tinta" },
    { x:2740, y:250, imagem:"assets/pinturas/2.jpg", titulo:"" },
    { x:2900, y:250, imagem:"assets/pinturas/3.jpg", titulo:"" },
    { x:3060, y:250, imagem:"assets/pinturas/4.jpg", titulo:"" },

    { x:2580, y:590, imagem:"assets/pinturas/5.jpg", titulo:"" },
    { x:2740, y:590, imagem:"assets/pinturas/6.jpg", titulo:"" },
    { x:2900, y:590, imagem:"assets/pinturas/7.jpg", titulo:"" },
    { x:3060, y:590, imagem:"assets/pinturas/8.jpg", titulo:"" }

];

function abrirModalQuadro(quadro){

    document.getElementById("modal-img").textContent = quadro.imagem;

    document.getElementById("modal-categoria").textContent = "Galeria de Arte";

    document.getElementById("modal-titulo").textContent = quadro.titulo;

    document.getElementById("modal-descricao").textContent = quadro.descricao;

    document.getElementById("modal-curiosidade-texto").textContent = quadro.curiosidade;

    document.getElementById("modal-img").src = quadro.imagem;

    document.getElementById("modal-card")
        .style.setProperty("--cor-categoria","#b58b2d");

    document.getElementById("modal-overlay")
        .classList.remove("oculto");

}

function renderizarGaleria(container){

    const tapete = document.createElement("div");
    tapete.className = "galeria-tapete";

    tapete.style.left = GALERIA.x + "px";
    tapete.style.top = GALERIA.y + "px";
    tapete.style.width = GALERIA.width + "px";
    tapete.style.height = GALERIA.height + "px";

    container.appendChild(tapete);

    QUADROS.forEach(criarQuadro.bind(null, container));

}

function criarQuadro(container, dados){

    const quadro = document.createElement("div");
    quadro.className = "quadro";

    quadro.dataset.id = dados.id;

    quadro.style.left = dados.x + "px";
    quadro.style.top = dados.y + "px";

    quadro.addEventListener("click", () => {
    abrirModalQuadro(dados);
     });

    const luz = document.createElement("div");
    luz.className = "quadro-luz";

    const img = document.createElement("img");
    img.src = dados.imagem;

    const placa = document.createElement("div");
    placa.className = "quadro-placa";
    placa.textContent = dados.titulo;

    quadro.appendChild(luz);
    quadro.appendChild(img);
    quadro.appendChild(placa);

    container.appendChild(quadro);

}
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
{
    x:2580,
    y:250,
    imagem:"assets/quadro1.webp",
    titulo:"Independência ou Morte",
    descricao:"Pintada por Pedro Américo em 1888, representa a proclamação da Independência do Brasil por Dom Pedro I às margens do riacho Ipiranga.",
    curiosidade:"A obra foi produzida 66 anos após a Independência e diversos elementos foram idealizados pelo artista.",
    tipo:"objeto"
},
{
    x:2740,
    y:250,
    imagem:"assets/abaporu.webp",
    titulo:"Abaporu",
    descricao:"Pintura de Tarsila do Amaral considerada um dos maiores símbolos do Modernismo brasileiro e do Movimento Antropofágico.",
    curiosidade:"O nome 'Abaporu' vem da língua tupi e significa 'homem que come gente'.",
    tipo:"objeto"
},
{
    x:2900,
    y:250,
    imagem:"assets/Obra-Os-Operarios-Tarsila-do-Amaral-1933-300x188.webp",
    titulo:"Operários",
    descricao:"Obra de Tarsila do Amaral que retrata a diversidade dos trabalhadores brasileiros durante o processo de industrialização.",
    curiosidade:"A pintura apresenta dezenas de rostos representando diferentes origens étnicas.",
    tipo:"objeto"
},
{
    x:3060,
    y:250,
    imagem:"assets/O-Lavrador-de-Cafe-1934-750x987.webp",
    titulo:"O Lavrador de Café",
    descricao:"Pintura de Cândido Portinari que representa o trabalhador rural nas plantações de café.",
    curiosidade:"É uma das obras mais conhecidas de Portinari sobre o trabalho no campo.",
    tipo:"objeto"
},

{
    x:2580,
    y:590,
    imagem:"assets/formacao_a-primeira-santa-missa-no-brasil.webp",
    titulo:"Primeira Missa no Brasil",
    descricao:"Victor Meirelles retrata a celebração da primeira missa realizada pelos portugueses em território brasileiro em 1500.",
    curiosidade:"A obra tornou-se uma das imagens mais conhecidas dos livros de História do Brasil.",
    tipo:"objeto"
},
{
    x:2740,
    y:590,
    imagem:"assets/2fe37807b651e233547579da16bfd4fe.webp",
    titulo:"Café",
    descricao:"Pintura de Cândido Portinari que mostra trabalhadores durante a colheita do café, atividade fundamental para a economia brasileira no século XX.",
    curiosidade:"Portinari retratou frequentemente trabalhadores em suas obras.",
    tipo:"objeto"
},
{
    x:2900,
    y:590,
    imagem:"assets/15574358745cd495e217418_1557435874_1x1_md.webp",
    titulo:"A Negra",
    descricao:"Obra modernista de Tarsila do Amaral inspirada nas raízes africanas presentes na formação da cultura brasileira.",
    curiosidade:"É considerada uma das pinturas mais importantes da primeira fase do Modernismo brasileiro.",
    tipo:"objeto"
},
{
    x:3060,
    y:590,
    imagem:"assets/os-retirantes-by-candido-portinari-oil-on-canvas-1944-v0-fmfazowwb5pa1.webp",
    titulo:"Retirantes",
    descricao:"Pintura de Cândido Portinari que retrata o sofrimento das famílias nordestinas obrigadas a deixar suas terras devido à seca e à pobreza.",
    curiosidade:"'Retirantes' tornou-se um dos maiores símbolos da denúncia das desigualdades sociais no Brasil.",
    tipo:"objeto"
}
];

function abrirModalQuadro(quadro) {

    const iconeEl = document.getElementById("modal-icone");
    const imgEl = document.getElementById("modal-img");

    // categoria
    document.getElementById("modal-categoria").textContent =
        "🖼️ Galeria de Arte";

    // título
    document.getElementById("modal-titulo").textContent =
        quadro.autor
        ? `${quadro.titulo} — ${quadro.autor}`
        : quadro.titulo;

    // descrição
    document.getElementById("modal-descricao").textContent =
        quadro.descricao;

    // curiosidade
    document.getElementById("modal-curiosidade-texto").textContent =
        quadro.curiosidade;

    // imagem
    imgEl.src = quadro.imagem;
    imgEl.style.display = "block";

    // esconder ícone
    iconeEl.style.display = "none";

    // cor dourada da galeria
    document.getElementById("modal-card").style.setProperty("--cor-categoria", "#b58b2d");
    
    document.getElementById("modal-card").classList.add("modal-com-imagem");

    // esconder botão "Saiba mais", caso exista
    const link = document.getElementById("modal-link");
    link.classList.add("oculto");

    // abrir modal
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
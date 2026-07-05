/**
 * Mapa do museu.
 * Define o tamanho do mundo, as salas (posição, cor, categoria)
 * e gera automaticamente as paredes de colisão de cada sala.
 */

const WORLD = { width: 2800, height: 2000 };

const WALL_THICK = 20;
const DOOR_GAP = 140;

// Cada sala tem uma porta voltada para o Hall Principal (o corredor central).
// doorSide indica em qual parede da sala fica essa porta.
const ROOMS = [
  { id: "festas", nome: "Sala de Festas Populares", categoria: "Festas Populares",
    x: 40, y: 40, w: 500, h: 400, cor: "#E4572E", icone: "🎉", doorSide: "bottom" },

  { id: "musica", nome: "Sala de Música", categoria: "Música",
    x: 630, y: 40, w: 500, h: 400, cor: "#F2A541", icone: "🎵", doorSide: "bottom" },

  { id: "dancas", nome: "Sala de Danças", categoria: "Danças",
    x: 1220, y: 40, w: 500, h: 400, cor: "#2A9D8F", icone: "💃", doorSide: "bottom" },

  { id: "afro", nome: "Sala de Cultura Afro-brasileira", categoria: "Cultura Afro-brasileira",
    x: 40, y: 560, w: 500, h: 400, cor: "#BC4749", icone: "🥁", doorSide: "top" },

  { id: "originarios", nome: "Sala dos Povos Originários", categoria: "Povos Originários",
    x: 630, y: 560, w: 500, h: 400, cor: "#386641", icone: "🪶", doorSide: "top" },

  { id: "artesanato", nome: "Sala de Artesanato", categoria: "Artesanato",
    x: 1220, y: 560, w: 500, h: 400, cor: "#8B5E3C", icone: "🧺", doorSide: "top" },

  { id: "Canganço", nome: "Sala de Canganço", categoria: "Canganço",
    x: 1780, y: 560, w: 500, h: 400, cor: "#c58f66", icone: "🧺", doorSide: "top" },
];

function construirParedesDaSala(sala) {
  const { x, y, w, h, doorSide } = sala;
  const paredes = [];
  const meioX = x + w / 2;

  // parede de cima
  if (doorSide === "top") {
    const inicioVao = meioX - DOOR_GAP / 2;
    paredes.push({ x: x, y: y, w: inicioVao - x, h: WALL_THICK });
    paredes.push({ x: inicioVao + DOOR_GAP, y: y, w: x + w - (inicioVao + DOOR_GAP), h: WALL_THICK });
  } else {
    paredes.push({ x: x, y: y, w: w, h: WALL_THICK });
  }

  // parede de baixo
  const yBaixo = y + h - WALL_THICK;
  if (doorSide === "bottom") {
    const inicioVao = meioX - DOOR_GAP / 2;
    paredes.push({ x: x, y: yBaixo, w: inicioVao - x, h: WALL_THICK });
    paredes.push({ x: inicioVao + DOOR_GAP, y: yBaixo, w: x + w - (inicioVao + DOOR_GAP), h: WALL_THICK });
  } else {
    paredes.push({ x: x, y: yBaixo, w: w, h: WALL_THICK });
  }

  // parede esquerda e direita (sem porta)
  paredes.push({ x: x, y: y, w: WALL_THICK, h: h });
  paredes.push({ x: x + w - WALL_THICK, y: y, w: WALL_THICK, h: h });

  return paredes;
}

const PAREDES_EXTERNAS = [
  { x: 0, y: 0, w: WORLD.width, h: WALL_THICK }, // topo
  { x: 0, y: WORLD.height - WALL_THICK, w: WORLD.width, h: WALL_THICK }, // base
  { x: 0, y: 0, w: WALL_THICK, h: WORLD.height }, // esquerda
  { x: WORLD.width - WALL_THICK, y: 0, w: WALL_THICK, h: WORLD.height }, // direita
];

const PAREDES = ROOMS.reduce(
  (acc, sala) => acc.concat(construirParedesDaSala(sala)),
  [...PAREDES_EXTERNAS]
);

function renderizarMapa(container) {
  container.style.width = WORLD.width + "px";
  container.style.height = WORLD.height + "px";

  // piso de cada sala + placa com o nome
  ROOMS.forEach((sala) => {
    const piso = document.createElement("div");
    piso.className = "sala-piso";
    piso.style.left = sala.x + "px";
    piso.style.top = sala.y + "px";
    piso.style.width = sala.w + "px";
    piso.style.height = sala.h + "px";
    piso.style.setProperty("--cor-sala", sala.cor);
    container.appendChild(piso);

    const placa = document.createElement("div");
    placa.className = "sala-placa";
    placa.style.left = sala.x + sala.w / 2 + "px";
    placa.style.top = sala.y + 14 + "px";
    placa.textContent = `${sala.icone} ${sala.nome}`;
    container.appendChild(placa);
  });

  // paredes (visual)
  PAREDES.forEach((p) => {
    const el = document.createElement("div");
    el.className = "parede";
    el.style.left = p.x + "px";
    el.style.top = p.y + "px";
    el.style.width = p.w + "px";
    el.style.height = p.h + "px";
    container.appendChild(el);
  });
}

function encontrarSalaAtual(x, y) {
  return ROOMS.find((s) => x >= s.x && x <= s.x + s.w && y >= s.y && y <= s.y + s.h);
}

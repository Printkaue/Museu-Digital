/**
 * game.js
 * Ponto de entrada da aplicação. Carrega o database.json, cria os
 * stands, o jogador e o joystick, e roda o loop principal do jogo.
 */
(function () {
  const viewport = document.getElementById("viewport");
  const mundo = document.getElementById("mundo");
  const telaCarregamento = document.getElementById("tela-carregamento");
  const btnExplorar = document.getElementById("btn-explorar");
  const salaAtualEl = document.getElementById("sala-atual");

  const DISTANCIA_INTERACAO = 70;

  let stands = [];
  let player = null;
  let joystick = null;
  let standProximo = null;

  // --- entrada via teclado (apoio para testes em computador) ---
  const teclas = {};
  window.addEventListener("keydown", (e) => (teclas[e.key.toLowerCase()] = true));
  window.addEventListener("keyup", (e) => (teclas[e.key.toLowerCase()] = false));

  function vetorTeclado() {
    let x = 0,
      y = 0;
    if (teclas["arrowleft"] || teclas["a"]) x -= 1;
    if (teclas["arrowright"] || teclas["d"]) x += 1;
    if (teclas["arrowup"] || teclas["w"]) y -= 1;
    if (teclas["arrowdown"] || teclas["s"]) y += 1;
    if (x !== 0 && y !== 0) {
      x *= 0.7071;
      y *= 0.7071;
    }
    return { x, y };
  }

  function obterVetorDeEntrada() {
    const vj = joystick.getVetor();
    if (Math.hypot(vj.x, vj.y) > 0.12) return vj;
    return vetorTeclado();
  }

  // --- colisão ---
  function retangulosSeSobrepoe(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function haColisaoEm(x, y) {
    const meiaLargura = player.w / 2;
    const meiaAltura = player.h / 2;
    const rect = { x: x - meiaLargura, y: y - meiaAltura, w: player.w, h: player.h };

    for (const parede of PAREDES) {
      if (retangulosSeSobrepoe(rect, parede)) return true;
    }
    for (const stand of stands) {
      if (retangulosSeSobrepoe(rect, stand.getRect())) return true;
    }
    return false;
  }

  // --- atualização por frame ---
  function atualizarJogador(dt) {
    const v = obterVetorDeEntrada();
    if (v.x === 0 && v.y === 0) return;

    if (v.x > 0.05) player.direcao = 1;
    else if (v.x < -0.05) player.direcao = -1;

    const distancia = player.speed * dt;

    // move em X e Y separadamente, permitindo "deslizar" ao longo das paredes
    const novoX = player.x + v.x * distancia;
    if (!haColisaoEm(novoX, player.y)) player.x = novoX;

    const novoY = player.y + v.y * distancia;
    if (!haColisaoEm(player.x, novoY)) player.y = novoY;

    player.x = Math.max(20, Math.min(WORLD.width - 20, player.x));
    player.y = Math.max(20, Math.min(WORLD.height - 20, player.y));
  }

  function atualizarCamera() {
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;

    let camX = player.x - vw / 2;
    let camY = player.y - vh / 2;

    camX = Math.max(0, Math.min(WORLD.width - vw, camX));
    camY = Math.max(0, Math.min(WORLD.height - vh, camY));

    mundo.style.transform = `translate(${-camX}px, ${-camY}px)`;
  }

  function verificarProximidade() {
    let maisProximo = null;
    let menorDistancia = Infinity;

    stands.forEach((stand) => {
      const d = Math.hypot(stand.x - player.x, stand.y - player.y);
      const dentroDoAlcance = d < DISTANCIA_INTERACAO;
      stand.setAtivo(dentroDoAlcance);
      if (dentroDoAlcance && d < menorDistancia) {
        menorDistancia = d;
        maisProximo = stand;
      }
    });

    standProximo = maisProximo;
    btnExplorar.classList.toggle("oculto", !standProximo);

    const sala = encontrarSalaAtual(player.x, player.y);
    salaAtualEl.textContent = sala ? `${sala.icone} ${sala.nome}` : "🏛️ Hall Principal";
  }

  // --- loop principal ---
  let ultimoTempo = null;
  function loop(tempoAtual) {
    if (ultimoTempo === null) ultimoTempo = tempoAtual;
    const dt = Math.min((tempoAtual - ultimoTempo) / 1000, 0.05);
    ultimoTempo = tempoAtual;

    atualizarJogador(dt);
    player.atualizarVisual();
    atualizarCamera();
    verificarProximidade();

    requestAnimationFrame(loop);
  }

  // --- interação ---
  btnExplorar.addEventListener("click", () => {
    if (standProximo) abrirModal(standProximo);
  });
  document.getElementById("modal-fechar").addEventListener("click", fecharModal);
  document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target.id === "modal-overlay") fecharModal();
  });

  // --- inicialização ---
  async function iniciar() {
    renderizarMapa(mundo);

    let dados;
    try {
      const resposta = await fetch("database.json");
      dados = await resposta.json();
    } catch (erro) {
      console.error("Não foi possível carregar database.json", erro);
      telaCarregamento.textContent = "Não foi possível carregar o museu. Verifique a conexão e recarregue a página.";
      return;
    }

    stands = dados.map((item) => {
      const sala = ROOMS.find((s) => s.categoria === item.categoria);
      const stand = new Stand(item);
      if (sala) {
        stand.icone = item.icone || sala.icone;
        stand.cor = sala.cor;
      }
      return stand;
    });
    stands.forEach((s) => s.render(mundo));

    player = new Player(900, 500);
    player.criarElemento(mundo);

    joystick = new Joystick(document.getElementById("joystick-base"), document.getElementById("joystick-maniche"));

    telaCarregamento.classList.add("oculto");
    requestAnimationFrame(loop);
  }

  iniciar();
})();

/**
 * Alterações no game.js para multiplayer.
 * Só as partes que mudam estão aqui — o resto do arquivo fica igual.
 */

// ── 1. Adicione estas variáveis junto das outras no topo do IIFE ──────────────

  let playerRemoto = null;   // sprite do outro jogador no mapa

// ── 2. Substitua a função iniciar() por esta versão ───────────────────────────

  async function iniciar() {
    renderizarMapa(mundo);

    let dados;
    try {
      const resposta = await fetch("database.json");
      dados = await resposta.json();
    } catch (erro) {
      console.error("Não foi possível carregar database.json", erro);
      telaCarregamento.textContent = "Não foi possível carregar o museu.";
      return;
    }

    stands = dados.map((item) => {
      const sala = ROOMS.find((s) => s.categoria === item.categoria);
      const stand = new Stand(item);
      if (sala) { stand.icone = item.icone || sala.icone; stand.cor = sala.cor; }
      return stand;
    });
    stands.forEach((s) => s.render(mundo));

    player = new Player(900, 500);
    player.criarElemento(mundo);

    joystick = new Joystick(
      document.getElementById("joystick-base"),
      document.getElementById("joystick-maniche")
    );

    // ── Multiplayer ──
    // Cria o sprite do outro jogador (começa invisível)
    playerRemoto = document.createElement("div");
    playerRemoto.id = "jogador-remoto";
    playerRemoto.style.cssText = `
      position: absolute;
      width: 40px;
      height: 40px;
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 9;
      font-size: 30px;
      filter: drop-shadow(0 2px 2px rgba(0,0,0,0.35));
    `;
    playerRemoto.textContent = "🧑";
    mundo.appendChild(playerRemoto);

    // Inicializa o multiplayer — quando chegar posição do outro, atualiza o sprite
    Multiplayer.inicializar((dados) => {
      playerRemoto.style.display = "flex";
      playerRemoto.style.left = dados.x - 20 + "px";
      playerRemoto.style.top  = dados.y - 20 + "px";
      playerRemoto.style.transform = dados.direcao < 0 ? "scaleX(-1)" : "scaleX(1)";
    });
    // ── fim Multiplayer ──

    telaCarregamento.classList.add("oculto");
    requestAnimationFrame(loop);
  }

// ── 3. No loop(), adicione o envio de posição no final ────────────────────────

  function loop(tempoAtual) {
    if (ultimoTempo === null) ultimoTempo = tempoAtual;
    const dt = Math.min((tempoAtual - ultimoTempo) / 1000, 0.05);
    ultimoTempo = tempoAtual;

    atualizarJogador(dt);
    player.atualizarVisual();
    atualizarCamera();
    verificarProximidade();

    // envia posição para o outro jogador a cada frame (só se conectado)
    Multiplayer.enviarPosicao(player.x, player.y, player.direcao);

    requestAnimationFrame(loop);
  }

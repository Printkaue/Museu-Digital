/**
 * multiplayer.js
 * Gerencia a conexão P2P entre dois jogadores usando PeerJS.
 *
 * Como usar:
 *   1. Jogador 1 abre o jogo — um ID aparece na tela
 *   2. Jogador 1 manda esse ID para o Jogador 2 (WhatsApp, etc.)
 *   3. Jogador 2 cola o ID no campo que aparece e clica em Conectar
 *   4. Conexão estabelecida — os dois se veem no mapa
 *
 * Usa o servidor de sinalização público do PeerJS só para trocar o ID inicial.
 * Depois disso a comunicação é direta entre os dois navegadores.
 */

//AINDA EM FASE DE TESTES, NÃO FUNCIONA.

const Multiplayer = (function () {

  // ── Estado ────────────────────────────────────────────────────────────────

  let peer        = null;   // instância do PeerJS
  let conexao     = null;   // canal de dados com o outro jogador
  let onReceber   = null;   // callback chamado quando chega posição do outro
  let meuId       = null;

  // ── UI ────────────────────────────────────────────────────────────────────

  function criarUI() {
    const painel = document.createElement("div");
    painel.id = "mp-painel";
    painel.innerHTML = `
      <div id="mp-status">Multiplayer</div>
      <div id="mp-meu-id" title="Clique para copiar"></div>
      <div id="mp-controles">
        <input id="mp-input" type="text" placeholder="ID do amigo" maxlength="36" />
        <button id="mp-btn-conectar">Conectar</button>
      </div>
    `;
    document.getElementById("app").appendChild(painel);

    // estilos injetados diretamente para não depender do style.css
    const style = document.createElement("style");
    style.textContent = `
      #mp-painel {
        position: absolute;
        top: max(14px, env(safe-area-inset-top));
        right: max(14px, env(safe-area-inset-right));
        z-index: 25;
        background: rgba(20, 16, 13, 0.82);
        color: #f5ecdb;
        font-family: "Nunito Sans", sans-serif;
        font-size: 13px;
        padding: 10px 14px;
        border-radius: 14px;
        backdrop-filter: blur(4px);
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 200px;
      }
      #mp-status {
        font-family: "Baloo 2", sans-serif;
        font-weight: 700;
        font-size: 14px;
        color: #f2a541;
      }
      #mp-meu-id {
        font-size: 11px;
        color: #aaa;
        cursor: pointer;
        word-break: break-all;
      }
      #mp-meu-id:hover { color: #f2a541; }
      #mp-controles {
        display: flex;
        gap: 6px;
      }
      #mp-input {
        flex: 1;
        padding: 5px 8px;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.2);
        background: rgba(255,255,255,0.1);
        color: #f5ecdb;
        font-size: 12px;
        outline: none;
      }
      #mp-input::placeholder { color: #888; }
      #mp-btn-conectar {
        padding: 5px 10px;
        border: none;
        border-radius: 8px;
        background: #f2a541;
        color: #2c1a05;
        font-family: "Baloo 2", sans-serif;
        font-weight: 700;
        font-size: 12px;
        cursor: pointer;
      }
      #mp-btn-conectar:active { opacity: 0.8; }
      #mp-btn-conectar:disabled { background: #555; color: #999; cursor: default; }
    `;
    document.head.appendChild(style);

    document.getElementById("mp-btn-conectar").addEventListener("click", () => {
      const id = document.getElementById("mp-input").value.trim();
      if (id) conectarA(id);
    });
  }

  function setStatus(texto, cor = "#f5ecdb") {
    const el = document.getElementById("mp-status");
    if (el) { el.textContent = texto; el.style.color = cor; }
  }

  function mostrarMeuId(id) {
    const el = document.getElementById("mp-meu-id");
    if (!el) return;
    el.textContent = `Seu ID: ${id} (clique para copiar)`;
    el.addEventListener("click", () => {
      navigator.clipboard.writeText(id).then(() => {
        el.textContent = "✅ ID copiado!";
        setTimeout(() => { el.textContent = `Seu ID: ${id} (clique para copiar)`; }, 2000);
      });
    });
  }

  function esconderControles() {
    const c = document.getElementById("mp-controles");
    const id = document.getElementById("mp-meu-id");
    if (c)  c.style.display  = "none";
    if (id) id.style.display = "none";
  }

  // ── Lógica PeerJS ─────────────────────────────────────────────────────────

  function inicializar(callbackReceber) {
    onReceber = callbackReceber;
    criarUI();
    setStatus("Conectando ao servidor…", "#aaa");

    // PeerJS carregado via CDN no HTML — gera um ID aleatório automaticamente
    peer = new Peer();

    peer.on("open", (id) => {
      meuId = id;
      mostrarMeuId(id);
      setStatus("Aguardando conexão", "#f2a541");
    });

    // Jogador 2 se conectou a mim
    peer.on("connection", (conn) => {
      _configurarConexao(conn);
      setStatus("✅ Conectado!", "#2a9d8f");
      esconderControles();
    });

    peer.on("error", (err) => {
      console.error("PeerJS erro:", err);
      setStatus("Erro de conexão", "#e45c2e");
    });
  }

  // Jogador 1 chama isso para se conectar ao Jogador 2
  function conectarA(idAlvo) {
    if (!peer) return;
    setStatus("Conectando…", "#aaa");
    const conn = peer.connect(idAlvo, { reliable: false }); // unreliable = mais rápido para posição
    _configurarConexao(conn);

    conn.on("open", () => {
      setStatus("✅ Conectado!", "#2a9d8f");
      esconderControles();
    });
  }

  function _configurarConexao(conn) {
    conexao = conn;

    conn.on("data", (dados) => {
      if (onReceber) onReceber(dados);
    });

    conn.on("close", () => {
      setStatus("Conexão encerrada", "#e45c2e");
      conexao = null;
    });

    conn.on("error", (err) => {
      console.error("Conexão erro:", err);
      setStatus("Erro na conexão", "#e45c2e");
    });
  }

  // Enviamos nossa posição a cada frame — só se houver conexão aberta
  function enviarPosicao(x, y, direcao) {
    if (!conexao || conexao.open === false) return;
    conexao.send({ x, y, direcao });
  }

  function estaConectado() {
    return conexao !== null && conexao.open;
  }

  return { inicializar, enviarPosicao, estaConectado };

})();

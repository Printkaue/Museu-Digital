/**
 * Classe Player.
 * Guarda a posição do personagem e sabe desenhar a si mesmo.
 * Toda a lógica de movimento/colisão fica em game.js, que é
 * quem conhece o mapa e os stands.
 */
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 40;
    this.h = 40;
    this.speed = 260; // pixels por segundo
    this.direcao = 1; // 1 = direita, -1 = esquerda
    this.el = null;
  }

  criarElemento(container) {
    const el = document.createElement("div");
    el.id = "jogador";
    el.innerHTML = `
      <span class="jogador-sombra"></span>
      <span class="jogador-icone">🧑</span>
    `;
    container.appendChild(el);
    this.el = el;
  }

  getRect() {
    return {
      x: this.x - this.w / 2,
      y: this.y - this.h / 2,
      w: this.w,
      h: this.h,
    };
  }

  atualizarVisual() {
    this.el.style.left = this.x - this.w / 2 + "px";
    this.el.style.top = this.y - this.h / 2 + "px";
    const icone = this.el.querySelector(".jogador-icone");
    icone.style.transform = this.direcao < 0 ? "scaleX(-1)" : "scaleX(1)";
  }
}

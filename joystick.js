/**
 * Classe Joystick.
 * Controle virtual: o visitante toca/arrasta dentro da base e o
 * "manche" segue o dedo, limitado ao raio da base. O vetor
 * resultante (-1..1 em x e y) é usado por game.js para mover o jogador.
 * Funciona com toque (mobile) e mouse (desktop, para testes).
 */
class Joystick {
  constructor(baseEl, manicheEl) {
    this.base = baseEl;
    this.maniche = manicheEl;
    this.raio = 42;
    this.ativo = false;
    this.origem = { x: 0, y: 0 };
    this.vetor = { x: 0, y: 0 };

    this._bindEventos();
  }

  _bindEventos() {
    const iniciar = (clientX, clientY) => {
      this.ativo = true;
      const rect = this.base.getBoundingClientRect();
      this.origem = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      this._atualizarPosicao(clientX, clientY);
    };

    const mover = (clientX, clientY) => {
      if (this.ativo) this._atualizarPosicao(clientX, clientY);
    };

    const soltar = () => {
      this.ativo = false;
      this.vetor = { x: 0, y: 0 };
      this.maniche.style.transform = "translate(-50%, -50%)";
    };

    // Toque (celular)
    this.base.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        const t = e.touches[0];
        iniciar(t.clientX, t.clientY);
      },
      { passive: false }
    );
    window.addEventListener(
      "touchmove",
      (e) => {
        if (!this.ativo) return;
        e.preventDefault();
        const t = e.touches[0];
        mover(t.clientX, t.clientY);
      },
      { passive: false }
    );
    window.addEventListener("touchend", soltar);
    window.addEventListener("touchcancel", soltar);

    // Mouse (para testar no computador)
    this.base.addEventListener("mousedown", (e) => iniciar(e.clientX, e.clientY));
    window.addEventListener("mousemove", (e) => mover(e.clientX, e.clientY));
    window.addEventListener("mouseup", soltar);
  }

  _atualizarPosicao(clientX, clientY) {
    let dx = clientX - this.origem.x;
    let dy = clientY - this.origem.y;
    const distancia = Math.hypot(dx, dy);

    if (distancia > this.raio) {
      dx = (dx / distancia) * this.raio;
      dy = (dy / distancia) * this.raio;
    }

    this.maniche.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    this.vetor = { x: dx / this.raio, y: dy / this.raio };
  }

  getVetor() {
    return this.vetor;
  }
}

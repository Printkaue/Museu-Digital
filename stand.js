/**
 * Classe Stand
 * Cada objeto do database.json vira uma instância desta classe.
 * O stand é responsável apenas por guardar seus dados e desenhar
 * a si mesmo no mapa. Nenhuma informação fica fixa no HTML.
 */
class Stand {
constructor(data) {
    this.id = data.id;
    this.nome = data.nome;
    this.categoria = data.categoria;
    this.descricao = data.descricao;
    this.curiosidade = data.curiosidade;
    this.tipo = data.tipo || null;

    this.imagem = data.imagem || null;   // <-- ADICIONE ESTA LINHA
    this.imagens = data.imagens || [];

    this.x = data.posicao.x;
    this.y = data.posicao.y;
    this.tamanho = 60;

    this.icone = data.icone || "🏺";
    this.cor = "#8B5E3C";

    this.el = null;
}
  // retângulo de colisão (o personagem não pode atravessar o stand)
  getRect() {
    const metade = this.tamanho / 2;
    return {
      x: this.x - metade,
      y: this.y - metade,
      w: this.tamanho,
      h: this.tamanho,
    };
  }

  render(container) {
    const el = document.createElement("div");
    el.className = "stand";
    el.style.left = this.x - this.tamanho / 2 + "px";
    el.style.top = this.y - this.tamanho / 2 + "px";
    el.style.setProperty("--cor-stand", this.cor);
    el.innerHTML = `
      <span class="stand-icone">${this.icone}</span>
      <span class="stand-rotulo">${this.nome}</span>
    `;
    container.appendChild(el);
    this.el = el;
  }

  setAtivo(ativo) {
    if (!this.el) return;
    this.el.classList.toggle("stand-ativo", ativo);
  }
}

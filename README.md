# Museu Digital da Diversidade Cultural Brasileira — Beta

Protótipo jogável em HTML, CSS e JavaScript puro (sem frameworks, sem backend).

## Como rodar

Como o jogo carrega `database.json` via `fetch`, ele precisa ser aberto por um
servidor local (abrir o `index.html` direto com duplo clique não funciona por
restrição do navegador). Duas formas simples:

**Com Python:**
```bash
cd museu
python3 -m http.server 8000
```
Depois acesse `http://localhost:8000` no navegador (ou no celular, na mesma rede Wi-Fi, usando o IP do computador).

**Com VS Code:** instale a extensão "Live Server" e clique em "Go Live".

## Controles

- **Celular:** use o joystick virtual no canto inferior esquerdo.
- **Computador (para testes):** setas do teclado ou W/A/S/D, ou clique e arraste no joystick com o mouse.
- Ao chegar perto de um stand, o botão **Explorar** aparece no canto inferior direito.

## Estrutura dos arquivos

| Arquivo | Responsabilidade |
|---|---|
| `index.html` | Estrutura da página |
| `style.css` | Toda a aparência visual |
| `database.json` | **Todo o conteúdo cultural do museu** |
| `stand.js` | Classe `Stand` (cada manifestação cultural) |
| `player.js` | Classe `Player` (o personagem) |
| `joystick.js` | Classe `Joystick` (controle virtual) |
| `map.js` | Salas, paredes e colisão do mapa |
| `modal.js` | Abertura/fechamento do card de informações |
| `game.js` | Loop principal: junta tudo e roda o jogo |

## Como adicionar uma nova manifestação cultural

Basta abrir `database.json` e acrescentar um novo objeto na lista, **sem
tocar em nenhum arquivo de código**:

```json
{
  "id": 13,
  "nome": "Boi-Bumbá",
  "categoria": "Festas Populares",
  "descricao": "Descrição da manifestação cultural...",
  "curiosidade": "Uma curiosidade interessante sobre ela...",
  "posicao": { "x": 300, "y": 250 }
}
```

- `categoria` precisa ser **exatamente igual** ao nome de uma das seis salas
  já existentes (definidas em `map.js`, no array `ROOMS`), para que o stand
  apareça na sala certa com a cor e o ícone corretos.
- `posicao` é o centro do stand dentro do mapa do mundo (1800×1000 pixels).
  Fique dentro da área da sala, longe das paredes.

## Sobre imagens, áudio e vídeo

Nesta versão beta os stands usam apenas emojis como identidade visual, para
manter o protótipo leve e sem depender de arquivos externos. A estrutura já
está pronta para receber mídia real: basta colocar os arquivos em
`assets/imagens/`, `assets/audios/` ou `assets/videos/`, referenciá-los no
campo `"imagens"` do JSON (ex.: `"assets/imagens/festa-junina.jpg"`) e
adaptar `modal.js` para exibi-los (por exemplo, trocando o ícone grande por
uma tag `<img>` quando o campo existir).

## Próximos passos sugeridos

- Adicionar mais stands em cada sala (o layout já reserva espaço para isso).
- Trocar os emojis por sprites/ilustrações próprias.
- Adicionar um menu inicial (`ui/menu.js`, previsto no planejamento original).
- Adicionar sons ambiente por sala e efeitos sonoros de interação.

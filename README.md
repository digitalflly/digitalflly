# Digitalflly · Conexões e Conteúdo

Página de links (Linktree-style) da Digitalflly. É um **site estático puro** — HTML + CSS,
sem build e **sem JavaScript externo**. A página carrega instantânea, sem depender de
nenhum CDN de runtime (React/Babel/unpkg).

## Estrutura

```
index.html      → a página inteira (HTML + CSS embutido)
assets/         → imagens (cabeçalho e capa do botão)
vercel.json     → configuração de deploy estático
```

## Rodar localmente

Não há build. Sirva os arquivos por HTTP (ou abra o `index.html` direto no navegador):

```bash
npx serve .
# ou
python3 -m http.server 3000
```

Depois acesse http://localhost:3000

## Editar conteúdo

Tudo está em `index.html`:

- **Link do WhatsApp:** atributo `href` do `<a class="link-card">`.
- **Imagens:** `assets/cabecalho.png` (topo) e `assets/capa-conteudo.png` (botão).
- **Instagram / e-mail:** `href` dos `<a class="social-btn">`.
- **Cores:** `#28140d` (fundo) e `#f5ebd6` (texto) no `<style>`.

## Deploy no Vercel (configuração recomendada)

Em **Project → Settings → Build and Deployment**:

| Configuração      | Valor                   |
| ----------------- | ----------------------- |
| Framework Preset  | **Other** (Nenhum)      |
| Build Command     | *(vazio / desligado)*   |
| Output Directory  | *(vazio — usa a raiz)*  |
| Install Command   | *(vazio / desligado)*   |
| Root Directory    | `./`                    |

O `vercel.json` já fixa `framework: null` e desliga o build, além de aplicar cache
longo nas imagens (`/assets/*`). Como **não há `package.json`**, o Vercel publica
os arquivos estáticos diretamente, sem etapa de build.

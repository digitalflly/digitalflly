# Digitalflly · Conexões e Conteúdo

Página de links (Linktree-style) da Digitalflly. É um **site estático** — não precisa de build.
A página é renderizada no navegador pelo runtime `support.js`, que carrega React 18 + Babel
sob demanda e monta o template `<x-dc>` definido em `index.html`.

## Estrutura

```
index.html      → página (template <x-dc> + dados/props)
support.js      → runtime que renderiza o template
assets/         → imagens (cabeçalho e capa do botão)
vercel.json     → configuração de deploy estático
```

## Rodar localmente

Como não há build, basta servir os arquivos por HTTP (não abra via `file://`,
o runtime precisa de um servidor):

```bash
npx serve .
# ou
python3 -m http.server 3000
```

Depois acesse http://localhost:3000

## Deploy no Vercel (configuração recomendada)

Em **Project → Settings → Build & Deployment**:

| Configuração         | Valor                        |
| -------------------- | ---------------------------- |
| Framework Preset     | **Other** (Nenhum)           |
| Build Command        | *(vazio / desligado)*        |
| Output Directory     | *(vazio — usa a raiz)*       |
| Install Command      | *(vazio / desligado)*        |
| Root Directory       | `./`                         |

O `vercel.json` deste repositório já fixa `framework: null` e desliga o build,
além de aplicar cache longo nas imagens (`/assets/*`). Como **não há `package.json`**,
o Vercel publica os arquivos estáticos diretamente, sem etapa de build.

> Editar o número de WhatsApp / cores: ver o bloco `data-props` e `renderVals()`
> no final do `index.html`.

# BiblioHub

Plataforma web de biblioteca escolar preparada para execução no **GitHub Codespaces**.

## O que esta versão possui

- React + TypeScript + Vite no front-end.
- Node.js + Express no back-end.
- Banco **SQLite** persistido no Codespace.
- Cadastro e login com senha protegida por `bcryptjs`.
- Perfil de **leitor** e **administrador/bibliotecário**.
- Acervo com quantidade total e exemplares disponíveis.
- Empréstimos com prazo automático de **14 dias**.
- Devolução de livros e atualização automática do estoque.
- Identificação de empréstimos atrasados.
- Reservas quando não há exemplar disponível.
- Favoritos e lista "Ler mais tarde" persistidos no banco.
- Painel administrativo com resumo do acervo, empréstimos, atrasos, reservas e leitores.
- Cadastro de novos livros pelo painel do administrador.

## Arquitetura

```text
React / Vite (porta 5173)
        |
        | /api (proxy do Vite)
        v
Node.js / Express (porta 3001)
        |
        v
SQLite
backend/data/bibliohub.db
```

O React **não acessa o SQLite diretamente**. Todas as operações passam pela API.

## Banco de dados

As tabelas são criadas automaticamente na primeira execução:

- `users`: leitores e administradores.
- `sessions`: sessões de login.
- `books`: acervo e quantidade de exemplares.
- `loans`: empréstimos e devoluções.
- `reservations`: reservas de livros indisponíveis.
- `favorites`: favoritos dos leitores.
- `read_later`: lista de leitura futura.

O arquivo `backend/data/bibliohub.db` está no `.gitignore` e **não deve ser enviado ao GitHub**.

## Credenciais de demonstração

### Leitor

```text
E-mail: aluno@bibliohub.edu.br
Senha: biblioteca123
```

### Administrador / bibliotecário

```text
E-mail: admin@bibliohub.edu.br
Senha: admin123
```

Novos leitores também podem usar **Criar conta** na tela inicial. Para esta atividade, o cadastro exige e-mail `@bibliohub.edu.br`.

# Como executar no GitHub Codespaces

## 1. Criar o repositório da equipe

Na organização `educacaoprofissional`, crie o repositório, por exemplo:

```text
educacaoprofissional/BiblioHub
```

Envie **o conteúdo desta pasta** para a raiz do repositório. `package.json`, `backend/` e `src/` devem aparecer diretamente na página principal.

## 2. Criar o Codespace

No GitHub:

1. Abra o repositório.
2. Clique em **Code**.
3. Abra **Codespaces**.
4. Clique em **Create codespace on main**.

O arquivo `.devcontainer/devcontainer.json` usa Node.js 22 e executa automaticamente:

```bash
npm install --no-audit --no-fund
```

## 3. Iniciar o projeto

No terminal:

```bash
npm start
```

Esse comando inicia os dois processos:

```text
API  -> http://localhost:3001
WEB  -> http://localhost:5173
```

## 4. Abrir no navegador

No Codespaces:

1. Abra **PORTS / PORTAS**.
2. Localize a porta **5173**.
3. Clique em **Open in Browser**.

A porta 3001 é a API e normalmente não precisa ser aberta manualmente.

# Comandos úteis

```bash
npm start        # front-end + API
npm run dev      # apenas React/Vite
npm run backend  # apenas API
npm run build    # build de produção do front-end
npm run typecheck
npm run test-api # teste rápido da API
```

## Testar a API

Com `npm start` rodando, abra outro terminal:

```bash
npm run test-api
```

Também é possível testar diretamente:

```bash
curl http://localhost:3001/api/status
```

# Fluxo de empréstimo

Quando um leitor clica em **Emprestar**:

1. A interface chama `POST /api/books/:id/borrow`.
2. A API verifica se o leitor já possui o livro.
3. A API verifica `available_copies`.
4. Um registro é criado em `loans`.
5. O estoque disponível é reduzido em 1.
6. O prazo de devolução é definido para 14 dias.

Na devolução, o empréstimo recebe `returned_at`, muda para `returned` e o exemplar volta ao estoque.

# Reservas

Se `available_copies` for 0, a interface apresenta **Reservar**. A reserva é gravada em `reservations`.

# Painel administrativo

Entre com a conta administrativa e abra **Administração** na barra lateral.

O painel permite:

- ver quantidade de títulos e exemplares;
- consultar empréstimos ativos e atrasados;
- visualizar reservas e leitores;
- registrar devolução pelo bibliotecário;
- cadastrar novos livros.

# Recriar o banco

Para reiniciar os dados de demonstração:

1. Pare a aplicação (`Ctrl + C`).
2. Apague o banco:

```bash
rm -f backend/data/bibliohub.db
```

3. Execute novamente:

```bash
npm start
```

As tabelas, usuários demo e livros serão recriados automaticamente.

# Salvar alterações no GitHub

```bash
git status
git add .
git commit -m "Implementa banco e gerenciamento da biblioteca"
git push
```

Confirme que `backend/data/bibliohub.db` **não aparece** no `git status`.

# Observação sobre GitHub Pages

GitHub Pages hospeda arquivos estáticos do front-end, mas **não executa Node.js/Express nem SQLite**. Para publicar o sistema completo futuramente, o backend e o banco deverão ser hospedados em um serviço apropriado (por exemplo uma API hospedada e PostgreSQL/Supabase).

## Estrutura principal

```text
BiblioHub/
├── .devcontainer/
├── backend/
│   ├── database.cjs
│   ├── server.cjs
│   └── data/              # banco local (ignorado pelo Git)
├── scripts/
├── src/
├── package.json
├── vite.config.ts
└── README.md
```

## Importante: SQLite e vários Codespaces

O arquivo SQLite fica dentro do próprio Codespace e está ignorado pelo Git. Portanto:

- o **código** é compartilhado pelo repositório GitHub;
- os **dados do banco local** não são automaticamente compartilhados entre Codespaces diferentes;
- para a apresentação/feira, escolha um Codespace principal do grupo e mantenha nele os dados de demonstração;
- para uso real por vários usuários ao mesmo tempo, a evolução natural é migrar o banco para PostgreSQL/Supabase ou outro banco hospedado.

## Se a instalação automática não ocorrer

Execute manualmente:

```bash
npm install --no-audit --no-fund
npm start
```

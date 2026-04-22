# API Node.js Template

Esta é uma API Node.js, capaz de gerenciar tarefas de usuários previamente cadastrados.
O objetivo deste projeto é fixar conhecimentos visto durante o curso de Node.js, utilizando as tecnologias Express, TypeScript e Prisma para criar uma estrutura básica de API.

## Descrição

O template inclui uma estrutura básica para uma API Node.js com:
- **Express**: Framework web para Node.js.
- **TypeScript**: Superset do JavaScript com tipagem estática.
- **Prisma**: ORM para interação com o banco de dados PostgreSQL.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Git](https://git-scm.com/)

## Como Usar Este Template

Este repositório é um template no GitHub. Para usá-lo:

1. Clique no botão **"Use this template"** no topo da página do repositório no GitHub.
2. Escolha um nome para o seu novo repositório e clique em **"Create repository from template"**.
3. Clone o repositório criado para sua máquina local:
   ```bash
   git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   cd SEU_REPOSITORIO
   ```

4. Configure as variáveis de ambiente (veja a seção de configuração abaixo).

## Configuração

1. Crie um arquivo `.env` na raiz do projeto com base no arquivo `.env-example`:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/seu_banco?schema=public"
   JWT_SECRET="sua_chave_secreta_para_jwt" (Pode ser qualquer string segura)
   ```

2. Ajuste as configurações no `prisma/schema.prisma` conforme necessário para o seu banco de dados.

## Instalação e Execução

### Desenvolvimento Local

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure o banco de dados PostgreSQL localmente ou use um serviço como NeonDB.

3. Crie as models e faça as migrações usando o Prisma:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Gere o cliente Prisma:
   ```bash
   npx prisma generate
   ```

5. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

6. A API estará disponível em `http://localhost:3000`.

## Estrutura do Projeto

```
├── src/
│   ├── controllers/     # Controladores da API
│   ├── database/        # Configurações do banco de dados
│   ├── dtos/            # Data Transfer Objects
│   ├── envs/            # Configurações de ambiente
│   ├── middlewares/     # Middlewares de autenticação, validação, etc.
│   ├── routes/          # Definições de rotas
│   ├── services/        # Lógica de negócio
│   ├── utils/           # Utilitários
│   └── server.ts        # Ponto de entrada da aplicação
├── prisma/
│   ├── schema.prisma    # Esquema do banco de dados
│   └── migrations/      # Migrações do Prisma
├── package.json         # Dependências e scripts
├── tsconfig.json        # Configuração do TypeScript
└── readme.md            # Este arquivo
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento com autoreload.
- `npm run build`: Compila o TypeScript para JavaScript.
- `npm run start`: Inicia o servidor em produção (após build).

## Tecnologias Utilizadas

- **Node.js**: Runtime JavaScript.
- **Express**: Framework web.
- **TypeScript**: Superset do JavaScript com tipagem estática.
- **Prisma**: ORM para banco de dados.
- **PostgreSQL**: Banco de dados relacional.
- **ts-node-dev**: Ferramenta para desenvolvimento com TypeScript e autoreload. (pode ocorrer erro e não funcionar o autoreload)

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está sob a licença ISC.
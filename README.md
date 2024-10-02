# Gerenciador de tarefas

Desenvolvido por [Lucas da Paz](https://www.linkedin.com/in/xlucaspx/) utilizando Node.js, TypeScript e Vue.js.

[Link do repositório](https://github.com/xLucaspx/vue-task-manager).

## Índice

- [Produto](#produto)
- [Executando o projeto](#executando-o-projeto)
  - [Variáveis de ambiente](#variáveis-de-ambiente)
  - [MySQL](#mysql)
  - [API](#api)
  - [Web](#web)
  - [Testes](#testes)
- [Requisitos e regras de negócio](#requisitos-e-regras-de-negócio)
  - [Requisitos funcionais](#requisitos-funcionais)
  - [Requisitos não funcionais](#requisitos-não-funcionais)
  - [Regras de negócio](#regras-de-negócio)

## Produto

Aplicação web que permite para os usuários o cadastro e gerenciamento de tarefas.

## Executando o projeto

Siga as instruções abaixo para configurar seu ambiente e executar o projeto pela primeira vez.

### Variáveis de ambiente

São utilizadas variáveis de ambiente para as credenciais do banco de dados e o segredo do token de autenticação. Renomeie o arquivo [_example.env_](./task-manager-api/example.env) para `.env` e preencha-o com os devidos valores.

Seu arquivo `.env` deverá se parecer com:

```env
# Database credentials:

DB_USERNAME = "seu_usuario"
DB_PASSWORD = "sua_senha"
DB_DATABASE = "nome_do_banco"

TEST_DATABASE = "banco_para_testes"

# JWT secret:

TOKEN_SECRET = "uma senha para validar seus tokens"
```

### MySQL

Este projeto utiliza o [_Sequelize_](https://sequelize.org/) como _ORM_ para realizar ações no banco de dados. Para que isso funcione corretamente, você precisa criar um banco de dados e, no arquivo `.env`, você deve substituir os valores de **DB_USERNAME** pelo nome do seu usuário que vai acessar o banco de dados no _MySQL_ (lembrando que o usuário deve ter as permissões necessárias para realizar as operações), **DB_PASSWORD** pela senha deste usuário - ou uma string vazia (`""`) caso não tenha senha - e **DB_DATABASE** pelo nome do banco de dados que você criou.

Utilizando as variáveis de ambiente, essas informações serão importadas no arquivo [_config.js_](./task-manager-api/config/config.js), desta forma:

```js
// ...
development: {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: "127.0.0.1",
  dialect: "mysql",
},
// ...
```

### API

Navegue até a pasta [_task-manager-api_](./task-manager-api/) pelo terminal e execute comando `npm i` para instalar as dependências do projeto. Quando a instalação for concluída, execute o seguinte script para criar as tabelas do banco e inserir alguns dados nelas:

```
npm run migrate-and-seed

# se preferir, você também pode executar as migrations e os seeders separadamente:

npm run migrate
npm run seed
```

Agora você já deve ter todas as tabelas do projeto criadas no seu banco, com os dados dos arquivos [_seeders_](./task-manager-api/seeders/) inseridos.

Para rodar o servidor no _backend_ do projeto, ainda no terminal e na pasta [_task-manager-api_](./task-manager-api/), execute o comando `npm start`.

### Web

Da mesma forma que na API, será preciso navegar pelo terminal até a pasta [_task-manager-web_](./task-manager-web/) e executar o comando `npm i` para instalar as dependências.

Para rodar a parte visual da aplicação, ainda no terminal e na pasta [_task-manager-web_](./task-manager-web/), execute o comando `npm run dev`.

### Testes

Foram desenvolvidos [testes](./task-manager-api/test/) na API utilizando o _test runner_ nativo do Node.js 20.5; para executá-los é necessário criar um banco de dados à parte e informá-lo no arquivo `.env` como `TEST_DATABASE = "banco-de-testes">`. Para criar as tabelas e executar os arquivos [_seeders_](./task-manager-api/seeders/), execute o script `npm run test:migrate-and-seed` dentro da pasta [_task-manager-api_](./task-manager-api/).

Foi utilizado o [_cross-env_](https://www.npmjs.com/package/cross-env) para definir o ambiente nos _scripts_ de teste. Com seu ambiente de testes configurado, utilize os seguintes _scripts_:

| Script                    | Descrição                                                                        |
| ------------------------- | -------------------------------------------------------------------------------- |
| `npm t`                   | roda os testes uma vez                                                           |
| `npm run test:watch`      | reinicia as _suites_ sempre que um arquivo é alterado                            |
| `npm run test:cov`        | utiliza o [_c8_](https://www.npmjs.com/package/c8) para gerar _coverage_ em HTML |
| `npm run test:cov-native` | gera um _output_ contendo as informações de _coverage_ no terminal               |

## Requisitos e regras de negócio

### Requisitos funcionais

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível ao usuário autenticado visualizar e editar suas informações;
- [ ] Deve ser possível que o usuário exclua seu cadastro;
- [x] Deve ser possível ao usuário autenticado criar tarefas;
- [x] Deve ser possível ao usuário autenticado visualizar suas tarefas;
- [x] Deve ser possível ao usuário autenticado editar suas tarefas;
- [x] Deve ser possível ao usuário autenticado marcar suas tarefas como concluídas;
- [x] Deve ser possível ao usuário autenticado excluir suas tarefas.

### Requisitos não funcionais

- [ ] O site deve ser acessível a todos os tipos de usuários (acessibilidade);
- [ ] O site deve ser responsivo e funcionar em desktop e dispositivos móveis;
- [x] A senha do usuário deve ser criptografada;
- [x] O usuário deve ser autenticado com JWT;
- [ ] Criar componentes que possam ser reutilizados, evitando repetição e facilitando a manutenibilidade do projeto;
- [x] Estruturar o projeto separando os arquivos por funcionalidade e coerência;
- [x] Procurar escrever o código de forma semântica e organizada, facilitando o entendimento do sistema;
- [x] Validar dados inseridos pelo usuário conforme regras de negócio;

### Regras de negócio

- [x] O usuário não pode se cadastrar com um e-mail duplicado;
- [x] O usuário não pode se cadastrar com um nome de usuário duplicado;
- [x] O nome de usuário deve conter apenas letras, números, hífen e underline e deve ter entre 3 e 20 caracteres;
- [x] A senha do usuário deve conter ao menos uma letra maiúscula, uma minúscula, um número e um caractere especial e deve ter entre 8 e 50 caracteres;
- [x] O campo e-mail deve ser validado;
- [x] O usuário deve estar autenticado para manipular tarefas;

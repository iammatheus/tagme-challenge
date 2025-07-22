# Desafio técnico - Tagme

### Sobre o desafio
Desenvolver uma aplicação CRUD em Angular e json-server.

### Requisitos
- Desenvolver uma aplicação que permita a criação, leitura, atualização e exclusão de itens.
- Integração com json-server
- Cada item deve ter, obrigatoriamente:
  - Título
  - Descrição
  - Imagem
- Opcional (Plus no teste): Incluir funcionalidade de recortar imagem

### Regras adicionais
- Formulário de Criação/Edição:
  - Título deve ser obrigatório.
  - Descrição deve ser obrigatória.
  - Foto deve ser obrigatória.
  - Deve mostrar algum feedback ao criar/editar, seja de sucesso ou de erro.
- Remoção de Item:
  - Deve haver uma mensagem de confirmação para o usuário antes de remover o item.
- Listagem:
  - Será um plus se houver filtro, ordenação e paginação.

### Como rodar o projeto
- Execute **npm install** para instalar as dependencias
- Crie na pasta **src/api** um arquivo chamado **db.json** utilizando o exemplo
- Rode a aplicação com **npm run start** ou **ng serve**
- Abra um outro terminal e execute **npm run server** para rodar o **json-server**

# ignite-desafio04-fastfeet

API para controle de encomendas de uma transportadora fictícia, a FastFeet.

### Conceitos praticados

- DDD, Domain Events, Clean Architecture
- Autenticação e Autorização (RBAC)
- Testes unitários e e2e
- Integração com serviços externos

### Regras da aplicação

- [x] A aplicação deve ter dois tipos de usuário, entregador e/ou admin
- Deve ser possível realizar login com CPF e Senha
- [x] Deve ser possível realizar o CRUD dos entregadores
- Deve ser possível realizar o CRUD das encomendas
- Deve ser possível realizar o CRUD dos destinatários
- Deve ser possível marcar uma encomenda como aguardando (Disponível para retirada)
- Deve ser possível retirar uma encomenda
- Deve ser possível marcar uma encomenda como entregue
- Deve ser possível marcar uma encomenda como devolvida
- Deve ser possível listar as encomendas com endereços de entrega próximo ao local do entregador
- Deve ser possível alterar a senha de um usuário
- Deve ser possível listar as entregas de um usuário
- Deve ser possível notificar o destinatário a cada alteração no status da encomenda

### Regras de negócio

- Somente usuário do tipo admin pode realizar operações de CRUD nas encomendas
- [x] Somente usuário do tipo admin pode realizar operações de CRUD dos entregadores
- Somente usuário do tipo admin pode realizar operações de CRUD dos destinatários
- Para marcar uma encomenda como entregue é obrigatório o envio de uma foto
- Somente o entregador que retirou a encomenda pode marcar ela como entregue
- Somente o admin pode alterar a senha de um usuário
- Não deve ser possível um entregador listar as encomendas de outro entregador

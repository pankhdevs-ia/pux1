# Reflexão
1. **Por que o formulário precisa ser validado antes de criar o usuário?**
   Para garantir a qualidade, integridade e consistência dos dados inseridos, além de prevenir cadastros duplicados (como e-mails repetidos) ou a entrada de informações incorretas/incompletas no sistema.

2. **Qual é a função do `preventDefault()`?**
   Ele interrompe a ação padrão enviada pelo navegador ao submeter um formulário, impedindo que a página recarregue e permitindo manipular os dados através do JavaScript de forma assíncrona.

3. **Por que o array `usuarios` é importante?**
   Atua como a "fonte central da verdade" (armazenamento temporário em memória) do sistema. Todas as operações de filtragem, atualização de status e relatórios utilizam esse array como referência.

4. **Qual é a vantagem da função `renderizarUsuarios`?**
   Reaproveitamento e centralização do código de alteração da interface (DOM). Ela garante que qualquer mudança no array de dados possa ser refletida na tela chamando uma única função.

5. **Qual é a diferença entre filtrar o array e alterar a tabela?**
   Filtrar o array consiste em processar logicamente a lista na memória e gerar um novo conjunto de dados. Alterar a tabela é o ato de atualizar os elementos visuais (HTML no DOM) com base nesse novo resultado.

6. **Por que bloquear um usuário é diferente de excluí-lo?**
   Bloquear revoga apenas as permissões de acesso do usuário mantendo o seu histórico salvo no sistema. Excluí-lo remove permanentemente seus dados do banco/memória.

7. **O que acontece com os dados quando a página é atualizada?**
   Como o s dados estão armazenados em variáveis na memória RAM do navegador (no array `usuarios`), todas as atualizações e novos cadastros são apagados e retornam ao seu estado inicial.

8. **O que seria necessário para transformar esta demonstração em um sistema real?**
   Seria necessária uma integração com um backend via API REST ou GraphQL, persistência de dados em um banco de dados relacional ou não  relacional, além de mecanismos reais de autenticação e criptografia de senhas (ex: JWT, hash bcrypt).
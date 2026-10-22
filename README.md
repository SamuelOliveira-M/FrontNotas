# FrontNotas / CollabPad

Aplicação de notas colaborativas desenvolvida em equipe no ambiente MAMBEE/IFPI. O frontend permite criar, editar, favoritar, pesquisar e remover notas, com sincronização de dados por Firestore, integração Socket.IO e upload de mídias no Cloudinary.

**Contribuição individual de Samuel Oliveira:** implementação da busca de notas com Elasticsearch. As demais funcionalidades são trabalho da equipe; não são atribuídas integralmente a Samuel.

## Tecnologias verificadas

React 18, TypeScript, JavaScript, Create React App (`react-scripts`), Axios, Firebase/Firestore, Socket.IO Client, Sass e Cloudinary. Elasticsearch é acessado por um serviço HTTP externo, não diretamente pelo SDK no navegador.

## Estrutura

```text
src/components/menu/Menu.tsx   entrada do termo de busca
src/pages/Posts/Posts.tsx      listagem, pesquisa e sincronização
src/lib/elasticApi.ts          criação, leitura, atualização e remoção no índice
src/lib/socket.ts             conexão Socket.IO
src/lib/cloudinaryApi.ts      upload de mídia
src/hooks/                    operações e escuta do Firestore
src/api/firebaseConfig.ts     configuração web do Firebase
src/constants.ts              endereços dos serviços HTTP e WebSocket
```

## Fluxo da busca

O menu atualiza `searchTerm` em `Posts.tsx`. Quando o termo não está vazio, a página chama `getNotas(searchTerm)`, que faz GET em `/documents/:titulo` no serviço de busca. A página combina os resultados do índice com documentos do Firestore pelo ID. Criação, alteração e remoção também tentam sincronizar o índice pelas funções de `elasticApi.ts`.

O [Elastic-Cloud](https://github.com/SamuelOliveira-M/Elastic-Cloud) contém um serviço compatível com esse contrato. Ele indexa em `my-index` e pesquisa por título usando `match` com `fuzziness: AUTO`. Essa implementação não comprova ganho quantitativo de performance nem pesquisa em todos os campos.

## Execução local

```bash
git clone https://github.com/SamuelOliveira-M/FrontNotas.git
cd FrontNotas
npm ci
npm start
```

Copie `.env.local.example` para `.env.local`. No código auditado, `REACT_APP_WS_SERVER_URL` configura o serviço Socket.IO. `ELASTIC_SEARCH_URL` foi usada sem o prefixo exigido pelo Create React App, portanto a configuração personalizada de busca não é incorporada corretamente ao bundle. A correção recomendada é migrar código e exemplo juntos para `REACT_APP_ELASTIC_SEARCH_URL`.

A configuração web do Firebase está em `src/api/firebaseConfig.ts`; ela identifica o projeto cliente e não equivale a uma chave privada de conta de serviço. As regras do Firestore, domínios e restrições de uso precisam ser verificados no console. Cloudinary usa configuração de upload embutida em `src/lib/cloudinaryApi.ts`; revisar os limites do preset na origem. Nunca adicionar credenciais privadas ao bundle.

Os serviços externos e os endereços históricos não foram acessados nem validados nesta auditoria. Para executar com segurança, usar projetos de desenvolvimento isolados. A documentação não oferece contas compartilhadas ou dados reais.

## Qualidade e limitações verificadas

- `npm run build` existe; `npm test` utiliza a infraestrutura do CRA, mas não foram encontrados testes próprios no snapshot auditado. Não foram executados nesta revisão.
- Adicionar debounce, cancelamento de pesquisas anteriores e tratamento de respostas fora de ordem.
- `getNotas` deve codificar o termo no caminho e retornar uma coleção tipada, incluindo resultados vazios.
- A sincronização Firestore/Elasticsearch não é transacional; criação não aguarda a indexação, podendo produzir divergências.
- O serviço de busca não apresenta controle de autenticação/autorização e exige correção antes de uso público com dados de usuários.
- O workflow atual envia a raiz do repositório ao GitHub Pages sem instalar dependências nem compilar React. Proposta: executar build e publicar somente `build/`, após aprovação explícita de deploy.
- O manifesto contém uma dependência para o próprio projeto (`file:`), a revisar.

O README anterior prometia resultados de performance sem benchmark e trazia o nome de outra pasta no comando de instalação. Essas afirmações e instruções foram corrigidas. Contribuições dos demais integrantes são preservadas no histórico Git.

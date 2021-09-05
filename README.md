[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h1 align="center">Mindzone API</h1>

  <p align="center">
    API REST para gerenciamento de requisições e regra de negócio da aplicação
    <br />
    <a href="https://mindzone.herokuapp.com/"><strong>Abrir app »</strong></a>
    <br />
    <br />
    <a href="https://github.com/CaioDev1/socialmedia-backend/issues">Reportar Bug</a>
    .
    <a href="https://github.com/CaioDev1/socialmedia-backend/issues">Requisitar funcionalidades</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Sumário</summary>
  <ol>
    <li>
      <a href="#sobre-o-projeto">Sobre a API</a>
      <ul>
        <li><a href="#feito-utilizando">Feito utilizando</a></li>
      </ul>
    </li>
    <li>
      <a href="#iniciando">Iniciando</a>
      <ul>
        <li><a href="#instalação">Instalação</a></li>
      </ul>
    </li>
    <li><a href="#rotas">Rotas</a></li>
    <li><a href="#mais-informações">API</a></li>
    <li><a href="#licença">Licença</a></li>
    <li><a href="#contato">Contato</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
<h2 id="sobre-o-projeto">💡 Sobre a API</h2>

A API feita em NodeJS utilizando o framework Express, trata de trabalhar as requisiões feitas pelo frontend em React, gereciando a entrada e saída de dados por separação de camadas,
sendo elas as camadas da aplicação Node e suas rotas, o Data Access Layer(DAO) para manipulação do banco de dados e a camada de tratamento de erros, que gerencia todas as excessões da aplicação
retornando os devidos status da requisição HTTP.

<h4>Funcionalidades</h4>

* Aplicação do modelo de banco de dados não relacional utilizando cluster MongoDB na nuvem.
* Autenticação das requisições autorizadas utilizando CORS
* Sistema de sessões da API implementado utilizando tokens JWT em cookies
* Manipulação e persistência dos arquivos de imagem da aplicação utilizando o storage bucket do Firebase
* Encriptação (hashing + salting) de senhas e dados sensíveis pelo bcrypt
* Validação de dados das requisições utilizando o Yup
* Manipulação de datas com o Moment
* Implementação de web sockets utilizando [socket.io](https://socket.io), criando canais de resposta em tempo real.
* Tratamento de erros da API utilizando middlewares

<h3 id="feito-utilizando">🔧 Dependências</h3>

Lista de dependências:
* [express](https://www.npmjs.com/package/express)
* [bcrypt](https://www.npmjs.com/package/bcrypt)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [cors](https://www.npmjs.com/package/cors)
* [cookie-parser](https://www.npmjs.com/package/cookie-parser)
* [express-session](https://www.npmjs.com/package/express-session)
* [firebase](https://www.npmjs.com/package/firebase)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [moment](https://www.npmjs.com/package/moment)
* [moment-timezone](https://www.npmjs.com/package/momento-timezone)
* [mongoose](https://www.npmjs.com/package/mongoose)
* [multer](https://www.npmjs.com/package/multer)
* [socket.io](https://www.npmjs.com/package/socket.io)
* [xhr2](https://www.npmjs.com/package/xhr2)
* [yup](https://www.npmjs.com/package/yup)



<!-- GETTING STARTED -->
<h2 id="Iniciando">📖 Iniciando</h2>

Para inicialização correta da aplicação, primeiro é necessário que o NodeJS e o gerenciador de pacotes NPM esteja instalado e atualizado.

<h3 id="instalação">⚙ Instalação</h3>

1. Clone o repositório
   ```sh
   git clone https://github.com/CaioDev1/socialmedia-backend.git
   ```
2. Instale os pacotes e dependências via NPM
   ```sh
   npm install
   ```
3. Crie um projeto no Firebase e inicie o bucket storage
   [Firebase Console](https://console.firebase.google.com/)
4. Altere as regras de autenticação do storage no console do Firebase
    ```
    service firebase.storage {
     match /b/social-media-project-d8015.appspot.com/o {
         match /{allPaths=**} {
           allow write: if request.auth == null
                        && request.resource.size < 10 * 1024 * 1024
                        && request.resource.contentType.matches('image/.*')
                        && request.resource.metadata.auth == 'SUA SENHA FIREBASE';
           allow read
         }
       }
     }
    ```
 5. Acesse o MongoDB Atlas e conecte o cluster com a aplicaçaõ através da URL cedida na plaforma do Atlas
    [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
 6. Crie um arquivo `.env` na raiz do projeto com todos os dados sensíveis da aplicação.
    ```
    ATRIBUTO=VALOR
    ATRIBUTO=VALOR
    
    ...
    ```

<!-- ROUTES -->
<h2 id="rotas">🛣 Rotas</h2>
<table>
  <thead>
    <tr>
      <th>ROTA</th>
      <th>MÉTODO</th>
    </tr>
  </thead>
  <tbody>
     <tr>
        <td>/chat</td>
        <td>GET</td>
     </tr>
     <tr>
        <td>/chat/:chatid</td>
        <td>GET</td>
     </tr>
     <tr>
        <td>/newmessage</td>
        <td>POST</td>
     </tr>
     <tr>
        <td>/lastchat</td>
        <td>GET</td>
     </tr>
     <tr>
        <td>/getpost/:postid</td>
        <td>GET</td>
     </tr>
     <tr>
        <td>/addcomment</td>
        <td>PATCH</td>
     </tr>
     <tr>
        <td>/friendlist/:db_user_id</td>
        <td>GET</td>
     </tr>
     <tr>
        <td>/arefriends</td>
        <td>POST</td>
     </tr>
     <tr>
        <td>/friendrequest</td>
        <td>PATCH</td>
     </tr>
     <tr>
        <td>/getfriendrequest</td>
        <td>POST</td>
     </tr>
     <tr>
        <td>/friendrequestresult</td>
        <td>POST</td>
     </tr>
     <tr>
        <td>/deletefriend</td>
        <td>DELETE</td>
     </tr>
     <tr>
        <td>/notification</td>
        <td>GET</td>
     </tr>
     <tr>
        <td>/register</td>
        <td>POST</td>
     </tr>
     <tr>
        <td>/login</td>
        <td>POST</td>
     </tr>
     <tr>
        <td>/logoff</td>
        <td>GET</td>
     </tr>
     <tr>
        <td>/</td>
        <td>GET</td>
     </tr>
     <tr>
        <td>/messagelist</td>
        <td>GET</td>
     </tr>
     <tr>
        <td>/posts</td>
        <td>POST</td>
     </tr>
     <tr>
        <td>/posts</td>
        <td>GET</td>
     </tr>
     <tr>
        <td>/post-buttons</td>
        <td>GET</td>
     </tr>
     <tr>
        <td>/post-buttons</td>
        <td>PATCH</td>
     </tr>
     <tr>
        <td>/profile/:db_user_id</td>
        <td>GET</td>
     </tr>
     <tr>
        <td>/topposts</td>
        <td>GET</td>
     </tr>
     <tr>
        <td>/userfilter</td>
        <td>GET</td>
     </tr>
     <tr>
        <td>/userposts</td>
        <td>GET</td>
     </tr>
  </tbody>
</table>

</br>

### Exemplo de requisição na rota `/posts`

</br>

```json
{
  "posts":[
    {
      "username":"Gabriel Fernandes",
      "photo":"https://firebasestorage.googleapis.com/v0/b/mindzone-1dce6.appspot.com/o/Gabriel%20Fernandes1629060880923%2F1629060880923_blob?alt=media&token=2c7c8552-2a66-48a0-a311-5531a170953e",
      "content":"Estou pensando em desenvolver uma nova aplicação, sugestões?",
      "_id":"61197f8a0818a60046fbfe07",
      "userId":"61197f120818a60046fbfe06",
      "timestamp":"15/08/2021 17:56"
    },
    {
      "username":"Caio Cardoso",
      "photo":"https://firebasestorage.googleapis.com/v0/b/mindzone-1dce6.appspot.com/o/Caio%20Cardoso1628876116831%2F1628876116831_blob?alt=media&token=84ec5b43-0da2-4456-9eb1-cb8b3a2d51a5",
      "content":"Bem-vindos!",
      "_id":"6117f4a1c43a35003ebf15e2",
      "userId":"6116ad58d3dfc20046413ae9",
      "timestamp":"14/08/2021 13:51"
    }
  ],
    "allPostsLength":2
}
```

<!-- USAGE EXAMPLES -->
<h2 id="mais-informações">ℹ Frontend</h2>

Além da parte da API da aplicação, temos a aplicação em React que trata toda a interface e esquema de requisição,
para acessa-la, basta ir para o link do repositório abaixo: 

_[Mindzone frontend](https://github.com/CaioDev1/socialmedia-frontend)_


<!-- LICENSE -->
<h2 id="licença">📜 Licença</h2>

Distribuído sobre a licença MIT. Veja `LICENSE` para mais informações.


<!-- CONTACT -->
<h2 id="contato">📩 Contato</h2>

Caio Cardoso - [@itsme_caio](https://instagram.com/itsme_caio) - imcaiofelipe@outlook.com

Link do projeto: [https://github.com/CaioDev1/socialmedia-backend](https://github.com/CaioDev1/socialmedia-backend)





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/CaioDev1/socialmedia-backend.svg?style=for-the-badge
[contributors-url]: https://github.com/CaioDev1/socialmedia-backend/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/CaioDev1/socialmedia-backend.svg?style=for-the-badge
[forks-url]: https://github.com/CaioDev1/socialmedia-backend/network/members
[stars-shield]: https://img.shields.io/github/stars/CaioDev1/socialmedia-backend.svg?style=for-the-badge
[stars-url]: https://github.com/CaioDev1/socialmedia-backend/stargazers
[issues-shield]: https://img.shields.io/github/issues/CaioDev1/socialmedia-backend.svg?style=for-the-badge
[issues-url]: https://github.com/CaioDev1/socialmedia-backend/issues
[license-shield]: https://img.shields.io/github/license/CaioDev1/socialmedia-backend.svg?style=for-the-badge
[license-url]: https://github.com/CaioDev1/socialmedia-backend/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/caio-cardoso-158133196

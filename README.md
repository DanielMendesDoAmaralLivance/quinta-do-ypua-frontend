# Como Rodar o Software

Este guia fornece os passos necessários para configurar e rodar o projeto localmente.

## Pré-requisitos

- Certifique-se de ter o **Node.js** e o **Yarn** instalados em sua máquina.
- Configure a API necessária antes de iniciar o projeto.

## Passos para Rodar o Projeto

1. **Instale as dependências do projeto**  
   No terminal, execute o seguinte comando:
   ```bash
   yarn
   ```

2. **Configure a API**  
    2.1. Baixe e configure a API por meio deste [repositório](https://github.com/DanielMendesDoAmaralLivance/quinta-do-ypua-backend).  
    2.2. Verifique se a **API** está configurada e rodando corretamente.  
    2.3. Atualize a variável `BASE_API_URL` no arquivo `src/config/constant.js` com a URL correta que o nest.js subiu a API (está configurado para subir na 3001).

3. **Inicie o projeto**  
    Execute o seguinte comando:
    ```bash
    yarn start
    ```

4. **Acesse o sistema**
    Após iniciar o projeto, ele estará disponível no navegador no endereço padrão: http://localhost:3000/app/accommodations
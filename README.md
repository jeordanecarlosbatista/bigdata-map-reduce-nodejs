# BigData Map/Reduce Nodejs
Cada arquivo no diretório './data' possui a seguinte estrutura:
journals/cl/SantoNR90:::Michele Di Santo::Libero Nigro::Wilma
Russo:::Programmer- Defined Control Abstractions in Modula-2.

### Cada uma das linhas pode ser entendida como:
- Informação bibliográfica;
- autores separados por '::';
- Título da obra

paper-id:::author1::author2::…. ::authorN:::title
A tarefa é fazer o cálculo de quantas vezes cada termo (no título da obra) acontece por autor;
Por exemplo para o autor 'Alberto Pettorossi' os seguinte termos acontecem (considerando
todos os documentos): program:3, transformation:2, transforming:2, using:2, programs:2,
and logic:2.

### Cada uma das linhas pode ser entendida como:
1. O separador de campos é “:::” e separador de autores é “::”;
1. Cada autor pode ter escrito múltiplas obras, que por sua vez podem estar em vários
arquivos;
1. Existe um lista de palavras que não serão consideradas. Utilize o arquivo
stopword.py do exercício prático: exclua todas estas palavras para os autores;
1. Se possível faça a exclusão de pontuações também, de forma que a palavra logic e
logic. sejam tratadas como se fossem uma única palavra;
1. Entregue a implementação do seu grupo;
1. Responda quais são as duas palavras que mais acontecem para os seguintes autores:
    1. a - “Grzegorz Rozenberg”
    1. b - “Philip S. Yu”

### Application tests
Your test will be via terminal

```bash
node app.js
```
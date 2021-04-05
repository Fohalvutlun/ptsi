
DROP TABLE IF EXISTS Dados_Sociodemograficos;

CREATE TABLE Dados_Sociodemograficos (
  id_dados_sociodemograficos INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
  idade INT NOT NULL,
  sexo VARCHAR(45) NOT NULL
);


DROP TABLE IF EXISTS Tempo;

CREATE TABLE Tempo (
  id_tempo INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
  dia INT NOT NULL,
  mes INT NOT NULL,
  ano INT NOT NULL
);


DROP TABLE IF EXISTS Dados_Agrupamento ;

CREATE TABLE Dados_Agrupamento (
  id_dados_agrupamento INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  contacto VARCHAR(13) NOT NULL,
  email VARCHAR(45) NOT NULL,
  codigo_agrupamento VARCHAR(45) NOT NULL UNIQUE
);



DROP TABLE IF EXISTS Questionario;

CREATE TABLE Questionario (
  id_questionario INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
  descricao VARCHAR(45) NULL,
  codigo_questionario VARCHAR(45) NOT NULL UNIQUE
);



DROP TABLE IF EXISTS Respostas_Questionario;

CREATE TABLE Respostas_Questionario (
  id_resposta_questionario INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
  pergunta1 VARCHAR(200) NOT NULL,
  pergunta2 VARCHAR(200) NULL,
  pergunta3 VARCHAR(200) NULL,
  pergunta4 VARCHAR(200) NOT NULL,
  pergunta5 VARCHAR(200) NULL,
  pergunta6 VARCHAR(200) NULL,
  risco VARCHAR(45) NOT NULL,
  id_tempo INT NOT NULL FOREIGN KEY REFERENCES Tempo(id_tempo),
  id_dados_agrupamento INT NOT NULL FOREIGN KEY REFERENCES Dados_Agrupamento(id_dados_agrupamento),
  id_dados_sociodemograficos INT NOT NULL FOREIGN KEY REFERENCES Dados_Sociodemograficos(id_dados_sociodemograficos),
  id_questionario INT NOT NULL  FOREIGN KEY REFERENCES Questionario(id_questionario)
);
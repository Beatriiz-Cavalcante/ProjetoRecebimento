CREATE TABLE IF NOT EXISTS public.operacoes_logistica
(
    id SERIAL PRIMARY KEY,
    fornecedor character varying(30) COLLATE pg_catalog."default",
    chegada_na_rua time without time zone,
    entrada_no_cd time without time zone,
    horario_saida time without time zone,
    data date,

    nome_motorista varchar(50),
    cpf_motorista varchar(11),
    placa_carro varchar(7),
    qt_notas integer,

    horario_inicio time without time zone,
    horario_final time without time zone,
    desconto_hora time without time zone,
    numero_palet integer,
    tipo_carga character varying(20) COLLATE pg_catalog."default",
    num_homens integer,

    avaria integer DEFAULT 0,
    volumes integer DEFAULT 0,
    descricao text COLLATE pg_catalog."default",

    observacao_manual text COLLATE pg_catalog."default",
    observacao_portaria text COLLATE pg_catalog."default",

    ativo boolean DEFAULT true,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,

    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'PENDENTE',
    observacao_status text COLLATE pg_catalog."default",

    status_portaria character varying(20) COLLATE pg_catalog."default" DEFAULT 'PENDENTE',
    observacao_status_portaria text COLLATE pg_catalog."default",

    status_recebimento character varying(20) COLLATE pg_catalog."default" DEFAULT 'PENDENTE',
    observacao_status_recebimento text COLLATE pg_catalog."default",

    CONSTRAINT operacoes_logistica_status_check
    CHECK (status IN ('PENDENTE', 'RESOLVIDO')),

    CONSTRAINT operacoes_logistica_status_portaria_check
    CHECK (status_portaria IN ('PENDENTE', 'RESOLVIDO')),

    CONSTRAINT operacoes_logistica_status_recebimento_check
    CHECK (status_recebimento IN ('PENDENTE', 'RESOLVIDO'))
);

ALTER TABLE IF EXISTS public.operacoes_logistica
    OWNER TO postgres;


INSERT INTO public.operacoes_logistica
(
    fornecedor,
    chegada_na_rua,
    entrada_no_cd,
    horario_saida,
    data,
    nome_motorista,
    cpf_motorista,
    placa_carro,
    qt_notas,
    horario_inicio,
    horario_final,
    desconto_hora,
    numero_palet,
    tipo_carga,
    num_homens,
    avaria,
    volumes,
    descricao,
    observacao_manual,
    observacao_portaria,
    ativo,
    criado_em,
    status,
    observacao_status,
    status_portaria,
    observacao_status_portaria,
    status_recebimento,
    observacao_status_recebimento
)
VALUES
(
    'CIA TESTE','09:00:00','09:30:00','10:00:00','2026-04-09','José Almeida','12345678901','ABC1234',5,'09:35:00','09:50:00','00:00:00',10,'PAL',1,0,0,'','','', true,
    '2026-04-09 14:38:30.377455','RESOLVIDO','Recebimento preenchido corretamente.','RESOLVIDO','Portaria preenchida corretamente.','RESOLVIDO','Recebimento preenchido corretamente.'
),
(
    'STA HELENA ATUALIZADO','07:00:00','19:00:00','19:05:00','2026-03-27','Marcos Silva','23456789012','DEF5678',8,'19:10:00','19:50:00','00:00:00',50,'PAL',2,1,10,
    'Atualizado','','',true,'2026-04-07 17:02:41.095546','RESOLVIDO','Recebimento preenchido corretamente.','RESOLVIDO','Portaria preenchida corretamente.','RESOLVIDO',
    'Recebimento preenchido corretamente.'
),
(
    'ALVOAR','07:21:00','08:00:00','08:10:00','2026-03-27','Carlos Mendes','34567890123','GHI9012',6,'17:20:00','18:20:00','00:00:00',70,'BAT',2, 0,0,'','','',true,
    '2026-03-31 17:37:08.967659','RESOLVIDO','Recebimento preenchido corretamente.','RESOLVIDO','Portaria preenchida corretamente.','RESOLVIDO','Recebimento preenchido corretamente.'
),
(
    'BALY','13:02:00','16:35:00','16:45:00','2026-03-17','André Souza','45678901234','JKL3456',4,'20:34:00','21:34:00','00:00:00', 70,'BAT',2,0,0,'','','',true,
    '2026-03-31 11:45:43.917861','RESOLVIDO','Recebimento preenchido corretamente.','RESOLVIDO','Portaria preenchida corretamente.','RESOLVIDO','Recebimento preenchido corretamente.'
),
(
    'FINE ATUALIZADO','06:00:00','15:00:00','15:10:00','2026-03-27','Paulo Henrique','56789012345','MNO7890',3,'15:10:00','15:50:00','00:00:00', 6,'PAL',1,NULL,NULL,'','','',true,
    '2026-03-30 17:41:46.510371','RESOLVIDO','Recebimento preenchido corretamente.','RESOLVIDO','Portaria preenchida corretamente.','RESOLVIDO','Recebimento preenchido corretamente.'
),
(
    'COMARY','05:00:00','12:00:00','12:10:00', '2026-03-30','Rogério Lima','67890123456','PQR1235', 7,'13:10:00','13:50:00','00:00:00',20,'BAT',2,NULL,NULL,'','','',true,
    '2026-03-30 17:24:26.194762','RESOLVIDO','Recebimento preenchido corretamente.','RESOLVIDO','Portaria preenchida corretamente.','RESOLVIDO','Recebimento preenchido corretamente.'
),
(
    'M DIAS','05:00:00','12:00:00','12:15:00','2026-03-30','Fernando Costa','78901234567','STU4567',2,'13:10:00','13:50:00','00:00:00',30,'PAL',2,NULL,NULL,'','','',true,
    '2026-03-30 17:01:55.662622','RESOLVIDO','Recebimento preenchido corretamente.','RESOLVIDO','Portaria preenchida corretamente.','RESOLVIDO','Recebimento preenchido corretamente.'
),
(
    'FINI','05:00:00','12:00:00','12:20:00','2026-03-30','Ricardo Nunes','89012345678','VWX8901',9,'13:10:00','13:50:00','00:00:00',30,'PAL',2,NULL,NULL,'','','',true,
    '2026-03-30 10:09:55.097642','RESOLVIDO','Recebimento preenchido corretamente.','RESOLVIDO','Portaria preenchida corretamente.','RESOLVIDO','Recebimento preenchido corretamente.'
);


CREATE TABLE IF NOT EXISTS public.usuarios
(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    perfil VARCHAR(20) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_perfil_usuario
    CHECK (perfil IN ('ADM', 'RECEBIMENTO', 'PORTARIA'))
);

ALTER TABLE IF EXISTS public.usuarios
    OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.tokens_recuperacao_senha
(
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES public.usuarios(id),
    token TEXT NOT NULL UNIQUE,
    usado BOOLEAN DEFAULT FALSE,
    expira_em TIMESTAMP NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
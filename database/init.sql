CREATE TABLE IF NOT EXISTS public.operacoes_logistica
(
    id SERIAL PRIMARY KEY,
    fornecedor character varying(100) COLLATE pg_catalog."default",
    chegada_na_rua time without time zone,
    entrada_no_cd time without time zone,
    data date,
    horario_inicio time without time zone,
    horario_final time without time zone,
    desconto_hora time without time zone,
    numero_palet integer,
    tipo_carga character varying(20) COLLATE pg_catalog."default",
    num_homens integer,
    avaria integer DEFAULT 0,
    volumes integer DEFAULT 0,
    descricao text COLLATE pg_catalog."default",
    ativo boolean DEFAULT true,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'PENDENTE',
    observacao_status text COLLATE pg_catalog."default",
    observacao_manual text COLLATE pg_catalog."default",
    CONSTRAINT operacoes_logistica_status_check CHECK (status IN ('PENDENTE', 'RESOLVIDO'))
);

ALTER TABLE IF EXISTS public.operacoes_logistica
    OWNER to postgres;

INSERT INTO public.operacoes_logistica
(
    fornecedor,
    chegada_na_rua,
    entrada_no_cd,
    data,
    horario_inicio,
    horario_final,
    desconto_hora,
    numero_palet,
    tipo_carga,
    num_homens,
    avaria,
    volumes,
    descricao,
    ativo,
    criado_em,
    status,
    observacao_status
)
VALUES
('CIA TESTE', '09:00:00', '09:30:00', '2026-04-09', '09:35:00', '09:50:00', '00:00:00', 10, 'PAL', 1, 0, 0, '', true, '2026-04-09 14:38:30.377455', 'RESOLVIDO', 'Registro preenchido corretamente.'),

('STA HELENA ATUALIZADO', '07:00:00', '19:00:00', '2026-03-27', '19:10:00', '19:50:00', '00:00:00', 50, 'PAL', 2, 1, 10, 'Atualizado', true, '2026-04-07 17:02:41.095546', 'RESOLVIDO', 'Conferido e atualizado pelo postman'),

('ALVOAR', '07:21:00', '08:00:00', '2026-03-27', '17:20:00', '18:20:00', '00:00:00', 70, 'BAT', 2, 0, 0, '', true, '2026-03-31 17:37:08.967659', 'RESOLVIDO', 'Registro preenchido corretamente.'),

('BALY', '13:02:00', '16:35:00', '2026-03-17', '20:34:00', '21:34:00', '00:00:00', 70, 'BAT', 2, 0, 0, '', true, '2026-03-31 11:45:43.917861', 'RESOLVIDO', 'Registro preenchido corretamente.'),

('FINE ATUALIZADO', '06:00:00', '15:00:00', '2026-03-27', '15:10:00', '15:50:00', '00:00:00', 6, 'PAL', 1, NULL, NULL, '', true, '2026-03-30 17:41:46.510371', 'RESOLVIDO', 'Registro preenchido corretamente.'),

('COMARY', '05:00:00', '12:00:00', '2026-03-30', '13:10:00', '13:50:00', '00:00:00', 20, 'BAT', 2, NULL, NULL, '', true, '2026-03-30 17:24:26.194762', 'RESOLVIDO', 'Registro preenchido corretamente.'),

('M DIAS', '05:00:00', '12:00:00', '2026-03-30', '13:10:00', '13:50:00', '00:00:00', 30, 'PAL', 2, NULL, NULL, '', true, '2026-03-30 17:01:55.662622', 'RESOLVIDO', 'Registro preenchido corretamente.'),

('FINI', '05:00:00', '12:00:00', '2026-03-30', '13:10:00', '13:50:00', '00:00:00', 30, 'PAL', 2, NULL, NULL, '', true, '2026-03-30 10:09:55.097642', 'RESOLVIDO', 'Registro preenchido corretamente.');
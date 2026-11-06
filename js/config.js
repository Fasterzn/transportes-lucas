/* =====================================================================
   TRANSPORTES LUCAS — ARQUIVO DE CONFIGURAÇÃO
   ---------------------------------------------------------------------
   Este é o ÚNICO lugar onde telefone, WhatsApp, e-mails, endereço e
   horário precisam ser alterados. Todo o site lê daqui.

   ATENÇÃO: o bloco de dados estruturados (JSON-LD) dentro do <head> do
   index.html repete telefone, endereço e horário para o Google. Se mudar
   algo aqui, atualize lá também (procure por "JSON-LD" no index.html).
   ===================================================================== */

window.TL = {

  /* ---------- Identificação ---------- */
  empresa: {
    razaoSocial: 'Transportes Lucas Ltda',
    nomeFantasia: 'Transportes Lucas',
    apelido: 'Translucas',
    cnpj: '11.091.193/0001-50',
    rntrc: '012613874',
  },

  /* ---------- Contato (CONFIRMAR ANTES DE PUBLICAR) ---------- */
  contato: {
    // Telefone fixo da matriz
    telefoneFixo: '(11) 4786-2759',
    telefoneFixoLink: '+551147862759',

    // WhatsApp / celular comercial
    whatsapp: '(11) 97688-7326',
    whatsappLink: '5511976887326',   // formato internacional, só dígitos

    emails: [
      'adm.taboao@transporteslucas.com.br',
      'cecilia@transporteslucas.com.br',
    ],
  },

  /* ---------- Mensagens pré-preenchidas do WhatsApp ---------- */
  mensagens: {
    padrao: 'Olá! Vim pelo site e gostaria de um orçamento de frete.',
    botaoFlutuante: 'Olá! Vim pelo site da Transportes Lucas. Gostaria de um orçamento de frete — posso passar a origem, o destino e o tipo de carga?',
  },

  /* ---------- Unidades ---------- */
  unidades: [
    {
      tipo: 'Matriz',
      cidade: 'Taboão da Serra',
      uf: 'SP',
      logradouro: 'Rua Casablanca, 154, Sala 1',
      bairro: 'Parque Monte Alegre',
      cep: '06756-400',
      principal: true,
    },
    {
      tipo: 'Filial',
      cidade: 'Gravataí',
      uf: 'RS',
      logradouro: '',           // ← endereço completo da filial, se quiser exibir
      bairro: '',
      cep: '',
      observacao: 'Apoio à rota SP ⇄ RS. Atendimento comercial centralizado na matriz.',
      principal: false,
    },
  ],

  /* ---------- Horário de atendimento ---------- */
  horario: {
    linhas: [
      'Segunda a quinta, das 8h às 18h',
      'Sexta, das 8h às 17h',
    ],
    // Formato schema.org, usado no JSON-LD do index.html
    schema: ['Mo-Th 08:00-18:00', 'Fr 08:00-17:00'],
  },

  /* ---------- Cobertura ---------- */
  // Estados atendidos. Alterar aqui pinta/despinta o mapa, monta os filtros
  // por região, atualiza o contador e a lista — tudo de uma vez.
  estados: [
    { uf: 'SP', nome: 'São Paulo',        regiao: 'Sudeste' },
    { uf: 'MG', nome: 'Minas Gerais',     regiao: 'Sudeste' },
    { uf: 'RJ', nome: 'Rio de Janeiro',   regiao: 'Sudeste' },
    { uf: 'PR', nome: 'Paraná',           regiao: 'Sul' },
    { uf: 'SC', nome: 'Santa Catarina',   regiao: 'Sul' },
    { uf: 'RS', nome: 'Rio Grande do Sul', regiao: 'Sul' },
    { uf: 'MT', nome: 'Mato Grosso',      regiao: 'Centro-Oeste' },
    { uf: 'MS', nome: 'Mato Grosso do Sul', regiao: 'Centro-Oeste' },
    { uf: 'BA', nome: 'Bahia',            regiao: 'Nordeste' },
    { uf: 'PE', nome: 'Pernambuco',       regiao: 'Nordeste' },
  ],

  // Ordem dos filtros do mapa. "Norte" aparece marcado como não atendido.
  regioes: ['Sudeste', 'Sul', 'Centro-Oeste', 'Nordeste', 'Norte'],

  // Nome e região de todas as 27 UFs — usado no balão do mapa quando o
  // visitante passa por um estado fora da área de atuação.
  ufs: {
    AC: ['Acre', 'Norte'],            AL: ['Alagoas', 'Nordeste'],
    AM: ['Amazonas', 'Norte'],        AP: ['Amapá', 'Norte'],
    BA: ['Bahia', 'Nordeste'],        CE: ['Ceará', 'Nordeste'],
    DF: ['Distrito Federal', 'Centro-Oeste'], ES: ['Espírito Santo', 'Sudeste'],
    GO: ['Goiás', 'Centro-Oeste'],    MA: ['Maranhão', 'Nordeste'],
    MG: ['Minas Gerais', 'Sudeste'],  MS: ['Mato Grosso do Sul', 'Centro-Oeste'],
    MT: ['Mato Grosso', 'Centro-Oeste'], PA: ['Pará', 'Norte'],
    PB: ['Paraíba', 'Nordeste'],      PE: ['Pernambuco', 'Nordeste'],
    PI: ['Piauí', 'Nordeste'],        PR: ['Paraná', 'Sul'],
    RJ: ['Rio de Janeiro', 'Sudeste'], RN: ['Rio Grande do Norte', 'Nordeste'],
    RO: ['Rondônia', 'Norte'],        RR: ['Roraima', 'Norte'],
    RS: ['Rio Grande do Sul', 'Sul'], SC: ['Santa Catarina', 'Sul'],
    SE: ['Sergipe', 'Nordeste'],      SP: ['São Paulo', 'Sudeste'],
    TO: ['Tocantins', 'Norte'],
  },

  /* ---------- Números da faixa "Nossa estrutura" ----------
     ⚠️ CONFIRMAR ANTES DE PUBLICAR. Os dois primeiros vieram do layout que
     você mandou e não estavam no briefing — eu não tenho como verificar.
     Se algum estiver errado, é só corrigir aqui.

     Observação sobre cobertura: o briefing e o mapa do site trabalham com
     10 estados. O layout falava em "20 UFs". Mantive 10 para o número não
     contradizer o mapa logo abaixo. Se o certo for 20, me avise que eu
     atualizo o número E o mapa juntos. */
  numeros: [
    { valor: 120, sufixo: '+', rotulo: 'Caminhões próprios',      nota: 'Frota própria em operação' },
    { valor: 10,  sufixo: '+', rotulo: 'Veículos agregados',      nota: 'Capacidade complementar' },
    { valor: 10,  sufixo: '',  rotulo: 'Estados atendidos',       nota: 'Sudeste, Sul, Centro-Oeste e Nordeste' },
    { valor: 4,   sufixo: '',  rotulo: 'Modalidades de veículo',  nota: 'Bitrem, carreta, truck e refrigerado' },
  ],

  /* ---------- Modalidades da frota ----------
     Cada item vira um card clicável na seção Frota, com a foto ao lado. */
  frota: [
    {
      nome: 'Bitrem',
      resumo: 'Veículos destinados a operações de transporte com grande capacidade de carga.',
      selo: 'Alta capacidade',
      foto: 'assets/img/frota-bitrem-patio.webp',
      alt: 'Bitrem Mercedes-Benz Actros da Transportes Lucas no pátio da empresa',
    },
    {
      nome: 'Carreta',
      resumo: 'Versatilidade para diferentes operações de transporte rodoviário de longa distância.',
      selo: 'Versatilidade',
      foto: 'assets/img/frota-rodotrem-rodovia.webp',
      alt: 'Rodotrem da Transportes Lucas rodando em rodovia de pista dupla',
    },
    {
      nome: 'Truck',
      resumo: 'Solução para operações que exigem veículo de menor porte em comparação à carreta.',
      selo: 'Agilidade urbana',
      foto: 'assets/img/doca-volvo-noturno.webp',
      alt: 'Caminhão truck Volvo da Transportes Lucas sendo carregado em doca',
    },
    {
      nome: 'Refrigerado',
      resumo: 'Veículos preparados para operações que exigem controle de temperatura.',
      selo: 'Temperatura controlada',
      foto: 'assets/img/scania-refrigerado-doca.webp',
      alt: 'Scania P370 com carreta refrigerada Thermo King da Transportes Lucas na doca',
    },
  ],

  /* ---------- Redes sociais ---------- */
  // Deixe '' para esconder o ícone no rodapé.
  redes: {
    instagram: '',   // ex.: 'https://instagram.com/transporteslucas'
    facebook: '',
    linkedin: '',
  },

  /* ---------- Site ---------- */
  site: {
    dominio: 'https://www.transporteslucas.com.br',  // ← confirmar domínio final
  },
};

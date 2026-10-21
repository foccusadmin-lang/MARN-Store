// Catálogo da MARN Store — adicione, remova ou edite produtos aqui.
//
// Campos de cada produto:
//   id, name, category, price, oldPrice (opcional, gera o selo "% OFF")
//   theme      tema/sub-categoria (ex.: "Cristã", "Namorados") — aparece nos filtros
//   occasions  datas especiais: "Natal", "Dia das Mães", "Dia dos Pais", "Namorados", "Aniversário"
//   audience   públicos: "Teens", "Adulto", "Cristão"
//   custom     true = mostra campo de personalização (nome, frase, foto)
//   sizes / options  variações (tamanho, cor, modelo, quantidade)
//   best       true = aparece em "Mais vendidos"
//   image      caminho/URL da foto (ex.: "img/caneca-fe.jpg"). Sem foto, usa emoji + cor.

// Menu principal (submenus). "filter" diz o que a página da categoria mostra.
window.MENU = [
  { title: "Presentes", items: [
    { label: "Canecas", filter: { category: "Canecas" } },
    { label: "Xícaras e Taças", filter: { category: "Xícaras e Taças" } },
    { label: "Copos e Garrafas", filter: { category: "Copos e Garrafas" } },
    { label: "Almofadas", filter: { category: "Almofadas" } },
    { label: "Luminárias e Decoração", filter: { category: "Decoração" } },
    { label: "Kits Presente", filter: { category: "Kits Presente" } }
  ]},
  { title: "Linha Cristã", items: [
    { label: "Bíblias", filter: { category: "Bíblias" } },
    { label: "Agendas e Cadernos", filter: { category: "Agendas e Cadernos" } },
    { label: "Canecas Cristãs", filter: { category: "Canecas", theme: "Cristã" } },
    { label: "Camisetas Cristãs", filter: { category: "Camisetas", audience: "Cristão" } },
    { label: "Kits de Fé", filter: { category: "Kits Presente", audience: "Cristão" } },
    { label: "Toda a linha cristã", filter: { audience: "Cristão" } }
  ]},
  { title: "Personalizados", items: [
    { label: "Camisetas", filter: { category: "Camisetas" } },
    { label: "Caneca com nome ou foto", filter: { category: "Canecas", custom: true } },
    { label: "Brindes e Lembrancinhas", filter: { category: "Brindes e Lembrancinhas" } },
    { label: "Ecobags e Aventais", filter: { category: "Têxtil" } },
    { label: "Tudo personalizável", filter: { custom: true } }
  ]},
  { title: "Datas especiais", items: [
    { label: "Natal", filter: { occasion: "Natal" } },
    { label: "Dia das Mães", filter: { occasion: "Dia das Mães" } },
    { label: "Dia dos Pais", filter: { occasion: "Dia dos Pais" } },
    { label: "Namorados", filter: { occasion: "Namorados" } },
    { label: "Aniversário", filter: { occasion: "Aniversário" } }
  ]}
];

window.AUDIENCES = ["Teens", "Adulto", "Cristão"];

window.PRODUCTS = [
  // ---------- Canecas ----------
  { id: 1,  name: "Caneca Personalizada com Nome", category: "Canecas", theme: "Personalizada", price: 39.9, oldPrice: 49.9, emoji: "☕", color: "#5BB8E8", rating: 4.9, audience: ["Teens","Adulto"], occasions: ["Aniversário"], custom: true, best: true, options: ["Branca","Preta","Interior colorido"], description: "Caneca de cerâmica 325 ml com o nome ou a frase que você quiser. Pode ir ao micro-ondas e à lava-louças." },
  { id: 2,  name: "Caneca Salmos 23 – O Senhor é meu Pastor", category: "Canecas", theme: "Cristã", price: 39.9, emoji: "🕊️", color: "#7B4FD8", rating: 5.0, audience: ["Cristão","Adulto"], custom: true, best: true, options: ["Branca","Rústica"], description: "Versículo de Salmos 23 com arte floral delicada. Personalize com o nome de quem vai receber." },
  { id: 3,  name: "Caneca Mulher Virtuosa – Provérbios 31", category: "Canecas", theme: "Cristã", price: 39.9, emoji: "🌸", color: "#D6338A", rating: 4.9, audience: ["Cristão","Adulto"], occasions: ["Dia das Mães"], custom: true, best: true, description: "Arte exclusiva inspirada em Provérbios 31. Um presente cheio de significado." },
  { id: 4,  name: "Caneca Casal – Nosso Amor", category: "Canecas", theme: "Namorados", price: 44.9, oldPrice: 54.9, emoji: "💞", color: "#D6338A", rating: 4.8, audience: ["Teens","Adulto"], occasions: ["Namorados"], custom: true, options: ["Com foto","Só com nomes"], description: "Caneca com foto do casal, nomes e data especial." },
  { id: 5,  name: "Caneca Divertida – Hoje Não", category: "Canecas", theme: "Divertidas", price: 34.9, emoji: "😴", color: "#F28C28", rating: 4.7, audience: ["Teens","Adulto"], description: "Para quem ama um bom humor antes do café." },
  { id: 6,  name: "Caneca Melhor Amiga do Mundo", category: "Canecas", theme: "Amiga", price: 36.9, emoji: "👯", color: "#5BB8E8", rating: 4.8, audience: ["Teens","Adulto"], occasions: ["Aniversário"], custom: true, description: "Celebre a amizade com nomes e uma frase só de vocês." },
  { id: 7,  name: "Caneca Família Abençoada", category: "Canecas", theme: "Família", price: 39.9, emoji: "🏡", color: "#B07A4A", rating: 4.9, audience: ["Cristão","Adulto"], occasions: ["Natal"], custom: true, description: "Com o sobrenome da família e um versículo à escolha." },
  { id: 8,  name: "Caneca Professor(a) Inspira", category: "Canecas", theme: "Profissões", price: 36.9, emoji: "📚", color: "#7B4FD8", rating: 4.8, audience: ["Adulto"], custom: true, description: "Homenagem para professores, com nome e disciplina." },
  { id: 9,  name: "Caneca Signos – Escolha o seu", category: "Canecas", theme: "Signos", price: 36.9, emoji: "✨", color: "#2E2350", rating: 4.6, audience: ["Teens","Adulto"], options: ["Áries","Touro","Gêmeos","Câncer","Leão","Virgem","Libra","Escorpião","Sagitário","Capricórnio","Aquário","Peixes"], description: "Arte celestial com as características do seu signo." },
  { id: 10, name: "Caneca Melhor Pai do Mundo", category: "Canecas", theme: "Família", price: 39.9, oldPrice: 46.9, emoji: "👨", color: "#3A6EA5", rating: 4.8, audience: ["Adulto"], occasions: ["Dia dos Pais"], custom: true, description: "Com nome do pai e dos filhos. Clássico que nunca erra." },
  { id: 11, name: "Caneca de Alumínio Personalizada", category: "Canecas", theme: "Personalizada", price: 24.9, emoji: "🥤", color: "#8D99AE", rating: 4.5, audience: ["Teens","Adulto"], custom: true, options: ["Prata","Dourada","Rosa"], description: "Leve e resistente, ótima para lembrancinhas e eventos." },
  { id: 12, name: "Caneca Teen – Vibes Coloridas", category: "Canecas", theme: "Divertidas", price: 36.9, emoji: "🌈", color: "#F28C28", rating: 4.8, audience: ["Teens"], custom: true, description: "Estampas criativas com o nome em destaque." },

  // ---------- Xícaras e Taças ----------
  { id: 13, name: "Caneca de Chopp Rústica 475 ml", category: "Xícaras e Taças", theme: "Rústica", price: 59.9, emoji: "🍺", color: "#B07A4A", rating: 4.8, audience: ["Adulto"], occasions: ["Dia dos Pais"], custom: true, best: true, description: "Vidro grosso com alça, gravação personalizada." },
  { id: 14, name: "Kit 4 Xícaras Empilháveis", category: "Xícaras e Taças", theme: "Elegante", price: 119.9, emoji: "☕", color: "#A8A29E", rating: 4.9, audience: ["Adulto"], options: ["Off-white","Colorido"], description: "Xícaras de porcelana com suporte, sofisticadas para a mesa do café." },
  { id: 15, name: "Xícara com Pires – Versículo", category: "Xícaras e Taças", theme: "Cristã", price: 49.9, emoji: "🫖", color: "#7B4FD8", rating: 4.9, audience: ["Cristão","Adulto"], occasions: ["Dia das Mães"], custom: true, description: "Xícara de porcelana com pires e versículo à escolha." },
  { id: 16, name: "Taça de Vinho Gravada", category: "Xícaras e Taças", theme: "Elegante", price: 54.9, emoji: "🍷", color: "#8E2C48", rating: 4.7, audience: ["Adulto"], occasions: ["Namorados"], custom: true, description: "Gravação delicada com nomes ou data." },

  // ---------- Copos e Garrafas ----------
  { id: 17, name: "Copo Térmico Personalizado 500 ml", category: "Copos e Garrafas", theme: "Personalizada", price: 89.9, oldPrice: 109.9, emoji: "🧋", color: "#5BB8E8", rating: 4.8, audience: ["Teens","Adulto"], custom: true, best: true, options: ["Preto","Branco","Lilás","Rosa"], description: "Mantém a temperatura por horas. Nome gravado a laser." },
  { id: 18, name: "Garrafa Squeeze Fé", category: "Copos e Garrafas", theme: "Cristã", price: 49.9, emoji: "🍶", color: "#7B4FD8", rating: 4.7, audience: ["Cristão","Teens"], custom: true, description: "Squeeze de alumínio 600 ml com frase de fé." },
  { id: 19, name: "Garrafa Térmica Inox 750 ml", category: "Copos e Garrafas", theme: "Elegante", price: 129.9, emoji: "🫗", color: "#2E2350", rating: 4.9, audience: ["Adulto"], occasions: ["Dia dos Pais"], custom: true, description: "Parede dupla, 12h quente / 24h gelado. Gravação personalizada." },

  // ---------- Camisetas ----------
  { id: 20, name: "Camiseta Personalizada – Sua Arte", category: "Camisetas", theme: "Personalizada", price: 59.9, oldPrice: 69.9, emoji: "👕", color: "#D6338A", rating: 4.8, audience: ["Teens","Adulto"], custom: true, best: true, sizes: ["P","M","G","GG","XG"], description: "100% algodão com a estampa, foto ou frase que você escolher." },
  { id: 21, name: "Camiseta Cristã – Fé", category: "Camisetas", theme: "Cristã", price: 64.9, emoji: "✝️", color: "#4A3A8C", rating: 4.9, audience: ["Cristão","Teens","Adulto"], best: true, sizes: ["P","M","G","GG"], description: "Estampa minimalista com detalhe em cruz. Malha premium." },
  { id: 22, name: "Camiseta Família / Grupo / Igreja", category: "Camisetas", theme: "Família", price: 54.9, emoji: "👨‍👩‍👧", color: "#5BB8E8", rating: 4.7, audience: ["Adulto","Teens","Cristão"], custom: true, sizes: ["Infantil","P","M","G","GG"], options: ["10 un.","20 un.","50 un."], description: "Para família, igreja, aniversário ou evento. Valor por unidade; descontos em quantidade." },
  { id: 23, name: "Camiseta Oversized Teen", category: "Camisetas", theme: "Teen", price: 79.9, emoji: "🎨", color: "#F28C28", rating: 4.8, audience: ["Teens"], custom: true, sizes: ["P","M","G","GG"], description: "Modelagem oversized com estampa autoral ou personalizada." },

  // ---------- Bíblias ----------
  { id: 24, name: "Bíblia Personalizada com Nome – Capa Floral", category: "Bíblias", theme: "Cristã", price: 129.9, emoji: "📖", color: "#D6338A", rating: 5.0, audience: ["Cristão","Adulto","Teens"], custom: true, best: true, options: ["NVI","ARC","NAA"], description: "Capa floral exclusiva com o nome de quem vai receber. Letra grande." },
  { id: 25, name: "Bíblia Rústica Couro & Madeira", category: "Bíblias", theme: "Rústica", price: 189.9, oldPrice: 229.9, emoji: "📜", color: "#8A5A36", rating: 4.9, audience: ["Cristão","Adulto"], custom: true, options: ["NVI","ARC","NAA"], description: "Capa em couro com detalhe em madeira e gravação a laser. Para guardar para sempre." },
  { id: 26, name: "Bíblia Teen com Espaço para Anotações", category: "Bíblias", theme: "Teen", price: 99.9, emoji: "📘", color: "#5BB8E8", rating: 4.8, audience: ["Cristão","Teens"], custom: true, options: ["Rosa","Azul","Lilás"], description: "Devocionais para adolescentes, margens largas e capa personalizável." },
  { id: 27, name: "Bíblia de Estudo Premium", category: "Bíblias", theme: "Elegante", price: 249.9, emoji: "📕", color: "#2E2350", rating: 4.9, audience: ["Cristão","Adulto"], options: ["Preta","Vinho","Marrom"], description: "Notas de estudo, mapas e concordância. Acabamento sofisticado." },

  // ---------- Agendas e Cadernos ----------
  { id: 28, name: "Agenda Cristã 2027 – Floral", category: "Agendas e Cadernos", theme: "Cristã", price: 54.9, emoji: "📒", color: "#D6338A", rating: 4.9, audience: ["Cristão","Adulto","Teens"], custom: true, best: true, description: "Versículo diário, planner mensal e páginas de oração. Capa com nome." },
  { id: 29, name: "Caderno de Oração", category: "Agendas e Cadernos", theme: "Cristã", price: 49.9, emoji: "🙏", color: "#7B4FD8", rating: 4.9, audience: ["Cristão"], custom: true, description: "Guia de oração, gratidão e pedidos. Capa personalizada." },
  { id: 30, name: "Caderno Devocional Teen", category: "Agendas e Cadernos", theme: "Teen", price: 44.9, emoji: "📓", color: "#F28C28", rating: 4.8, audience: ["Cristão","Teens"], custom: true, description: "Devocional criativo com espaço para desenhos e anotações." },

  // ---------- Almofadas ----------
  { id: 31, name: "Almofada Personalizada com Foto", category: "Almofadas", theme: "Personalizada", price: 69.9, emoji: "🛋️", color: "#5BB8E8", rating: 4.8, audience: ["Teens","Adulto"], occasions: ["Namorados","Dia das Mães"], custom: true, description: "Almofada 40x40 cm com a foto e a frase que você quiser." },
  { id: 32, name: "Kit Cinema – Almofada + Manta", category: "Almofadas", theme: "Kit", price: 129.9, oldPrice: 149.9, emoji: "🍿", color: "#2E2350", rating: 4.9, audience: ["Teens","Adulto"], occasions: ["Namorados"], custom: true, description: "Almofada personalizada, manta de microfibra e balde de pipoca." },

  // ---------- Decoração ----------
  { id: 33, name: "Luminária Personalizada de LED", category: "Decoração", theme: "Personalizada", price: 89.9, emoji: "💡", color: "#F28C28", rating: 4.8, audience: ["Teens","Adulto"], custom: true, description: "Acrílico gravado com nome ou frase e base de LED colorida." },
  { id: 34, name: "Oratório Iluminado", category: "Decoração", theme: "Cristã", price: 119.9, emoji: "⛪", color: "#7B4FD8", rating: 4.9, audience: ["Cristão","Adulto"], description: "Peça de MDF com iluminação suave, para um cantinho de oração." },
  { id: 35, name: "Azulejo Decorativo com Versículo", category: "Decoração", theme: "Cristã", price: 34.9, emoji: "🖼️", color: "#3A9FD6", rating: 4.8, audience: ["Cristão","Adulto"], custom: true, description: "Azulejo 15x15 cm com suporte. Versículo ou frase à escolha." },
  { id: 36, name: "Globo de Neve Natalino", category: "Decoração", theme: "Natal", price: 69.9, emoji: "🎄", color: "#2F8F5B", rating: 4.7, audience: ["Teens","Adulto"], occasions: ["Natal"], custom: true, description: "Globo com nome personalizado. Encanto para a ceia." },

  // ---------- Kits Presente ----------
  { id: 37, name: "Kit Simples & Carinhoso", category: "Kits Presente", theme: "Kit", price: 79.9, emoji: "🎁", color: "#5BB8E8", rating: 4.8, audience: ["Teens","Adulto"], occasions: ["Aniversário"], custom: true, best: true, description: "Caneca personalizada, chocolate e cartão com mensagem." },
  { id: 38, name: "Kit Café Rústico", category: "Kits Presente", theme: "Rústica", price: 149.9, emoji: "🧺", color: "#B07A4A", rating: 4.9, audience: ["Adulto"], occasions: ["Dia dos Pais","Dia das Mães"], custom: true, description: "Caixa de madeira com caneca rústica, café especial e biscoitos artesanais." },
  { id: 39, name: "Kit Fé & Gratidão", category: "Kits Presente", theme: "Cristã", price: 229.9, oldPrice: 269.9, emoji: "🕊️", color: "#7B4FD8", rating: 5.0, audience: ["Cristão","Adulto"], occasions: ["Natal","Dia das Mães"], custom: true, best: true, description: "Bíblia personalizada, caneca com versículo, vela aromática e cartão." },
  { id: 40, name: "Kit Premium Elegance", category: "Kits Presente", theme: "Elegante", price: 349.9, emoji: "💝", color: "#D6338A", rating: 4.9, audience: ["Adulto","Cristão"], custom: true, description: "Bíblia rústica, caneca personalizada, camiseta e caixa presente com laço." },
  { id: 41, name: "Kit Churrasco Personalizado", category: "Kits Presente", theme: "Rústica", price: 149.9, emoji: "🔪", color: "#5A3E2B", rating: 4.8, audience: ["Adulto"], occasions: ["Dia dos Pais"], custom: true, description: "Tábua de madeira gravada, faca com estojo e avental." },
  { id: 42, name: "Kit Teen Vibes", category: "Kits Presente", theme: "Teen", price: 139.9, emoji: "🎉", color: "#F28C28", rating: 4.8, audience: ["Teens"], occasions: ["Aniversário"], custom: true, description: "Camiseta oversized, caneca divertida e adesivos." },
  { id: 43, name: "Kit Natal em Família", category: "Kits Presente", theme: "Natal", price: 189.9, oldPrice: 219.9, emoji: "🎅", color: "#B3261E", rating: 4.9, audience: ["Adulto","Cristão"], occasions: ["Natal"], custom: true, description: "Caneca da família, globo de neve e panetone, em caixa natalina." },

  // ---------- Brindes e Lembrancinhas ----------
  { id: 44, name: "Chaveiro Personalizado (kit 10 un.)", category: "Brindes e Lembrancinhas", theme: "Brinde", price: 49.9, emoji: "🔑", color: "#8D99AE", rating: 4.7, audience: ["Adulto"], custom: true, options: ["10 un.","20 un.","50 un."], description: "Chaveiros em acrílico ou MDF com nome ou logo. Ideal para eventos." },
  { id: 45, name: "Caneta Metal Gravada (kit 10 un.)", category: "Brindes e Lembrancinhas", theme: "Brinde", price: 59.9, emoji: "🖊️", color: "#2E2350", rating: 4.6, audience: ["Adulto"], custom: true, options: ["10 un.","20 un.","50 un."], description: "Caneta touch em metal com gravação a laser." },
  { id: 46, name: "Lembrancinha Batizado / Chá", category: "Brindes e Lembrancinhas", theme: "Cristã", price: 89.9, emoji: "🎀", color: "#5BB8E8", rating: 4.9, audience: ["Cristão","Adulto"], custom: true, options: ["10 un.","20 un.","50 un."], description: "Mini terço ou mini caneca com tag personalizada." },

  // ---------- Têxtil ----------
  { id: 47, name: "Ecobag Personalizada", category: "Têxtil", theme: "Personalizada", price: 29.9, emoji: "👜", color: "#B07A4A", rating: 4.7, audience: ["Teens","Adulto"], custom: true, description: "Ecobag de algodão cru com estampa personalizada." },
  { id: 48, name: "Avental com Bolso Personalizado", category: "Têxtil", theme: "Rústica", price: 44.9, emoji: "🧑‍🍳", color: "#5A3E2B", rating: 4.8, audience: ["Adulto"], occasions: ["Dia dos Pais","Dia das Mães"], custom: true, description: "Avental de sarja com nome bordado ou estampado." }
];

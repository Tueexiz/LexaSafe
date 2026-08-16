export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";
export const LOCALE_COOKIE = "lexasafe-locale";

export const fr = {
  nav: {
    home: "Accueil",
    how: "Comment ça marche",
    simulator: "Simulateur",
    pricing: "Tarifs",
    team: "L'Équipe",
    login: "Se connecter",
    cta: "Demander un accès",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer",
    language: "Langue",
    fr: "FR",
    en: "EN",
  },
  common: {
    backHome: "Retour à l'accueil",
    contact: "Contact",
    product: "Produit",
    legal: "Informations légales",
  },
  footer: {
    blurb:
      "Passerelle souveraine de réquisitions judiciaires. Hébergée en France chez OVHcloud SecNumCloud (ANSSI).",
    access: "Demander un accès",
    simulator: "Simulateur",
    pricing: "Tarifs",
    team: "Équipe",
    faq: "FAQ",
    legal: "Mentions légales",
    terms: "CGU & SLA",
    privacy: "Confidentialité (RGPD)",
    cookies: "Politique cookies",
    rights: "Tous droits réservés · 100% Souverain · Zéro Connaissance",
    compliance: "Conforme LCEN · RGPD · e-Evidence · Hébergement OVHcloud SAS, Roubaix (FR)",
  },
  hero: {
    kicker: "Passerelle souveraine · Réquisitions Judiciaires",
    aria: "Sécurisez et Automatisez Vos Réquisitions",
    lines: [
      { words: ["Sécurisez", "&"] },
      { words: ["Automatisez"], accent: 0 },
      { words: ["Vos", "Réquisitions"] },
    ] as { words: string[]; accent?: number }[],
    leadBefore: "Le standard ",
    leadStrong1: "100% français et souverain",
    leadMid: ", taillé pour la ",
    leadStrong2: "nouvelle loi européenne e-Evidence",
    leadHost: ". Hébergé chez ",
    leadStrong3: "OVHcloud SecNumCloud",
    leadZero: " avec garantie ",
    leadStrong4: "Zéro Connaissance",
    leadEnd: ".",
    cta: "Demander un accès",
    simulate: "Simuler vos économies",
    chips: [
      "100% Souverain Français",
      "Canaux sécurisés de bout en bout",
      "Loi européenne 2026",
      "Évitez l'amende de 2% du CA",
    ],
    stats: [
      { title: "Plus rapide", sub: "Traitement immédiat" },
      { title: "100%", sub: "Hébergé en France" },
      { title: "0", subTitle: "Fraudes", sub: "Aucune fraude passée" },
    ],
  },
  workflow: {
    badge: "En 3 étapes",
    title: "Comment fonctionne LexaSafe",
    steps: [
      {
        title: "Le policier envoie sa demande",
        text: "L'officier dépose sa demande officielle sur LexaSafe. C'est gratuit pour les forces de l'ordre.",
      },
      {
        title: "On vérifie que c'est bien lui",
        text: "LexaSafe confirme l'identité de l'officier et bloque les faux policiers. Vos fichiers restent illisibles pour tout le monde, y compris pour nous.",
      },
      {
        title: "Vous envoyez le dossier, scellé",
        text: "Votre entreprise génère l'archive en un clic, horodatée et scellée, prête à être remise.",
      },
    ],
  },
  advantages: {
    badge: "Pourquoi LexaSafe",
    title: "Pourquoi choisir LexaSafe ?",
    items: [
      {
        title: "Sécurité inviolable",
        text: "Vos fichiers sont chiffrés de bout en bout : personne d'autre ne peut les lire.",
      },
      {
        title: "100% Souverain",
        text: "Hébergé en France chez OVHcloud. Vos données ne passent pas par les États-Unis.",
      },
      {
        title: "Amendes évitées",
        text: "Vous répondez dans les délais et vous ne transmettez rien à un imposteur.",
      },
    ],
  },
  dangers: {
    badge: "Risques évités pour votre entreprise",
    title: "Ce qui arrive si une demande n'est pas sécurisée",
    items: [
      {
        badge: "Amende",
        title: "Jusqu'à 2% de votre chiffre d'affaires",
        text: "Envoyer des données à un faux policier est une violation grave. L'amende peut atteindre 2% de votre CA mondial.",
      },
      {
        badge: "Arnaque",
        title: "Des faux policiers existent déjà",
        text: "Des fraudeurs se font passer pour des officiers pour voler les données de vos clients. Sans vérification, le risque est permanent.",
      },
      {
        badge: "Urgence",
        title: "Parfois, vous n'avez que 8 heures",
        text: "Certaines demandes urgentes exigent une réponse en moins de 8 heures. Un retard peut engager vos dirigeants.",
      },
    ],
  },
  calculator: {
    badge: "Simulateur",
    title: "Combien ça vous coûte aujourd'hui ?",
    subtitle:
      "Deux curseurs. Un aperçu simple du risque et du temps que vous pouvez gagner — sans jargon.",
    revenue: "Chiffre d'affaires de votre entreprise",
    revenueAria: "Chiffre d'affaires",
    sme: "Petite entreprise",
    mid: "ETI",
    large: "Grand groupe",
    volume: "Demandes de police par an",
    volumeAria: "Nombre de demandes",
    fineLabel: "Amende possible",
    fineHint: "Si des données partent à la mauvaise personne",
    severe: "Dans les cas les plus graves : jusqu'à {amount}",
    refusal: "Si vous refusez une demande sans raison valable : {amount}",
    hours: "Temps gagné chaque année",
    savings: "Argent économisé chaque année",
    footnote: "Estimations selon le RGPD et le droit français.",
  },
  pricing: {
    badge: "Offre",
    title: "Abonnement souverain",
    subtitle: "La passerelle clé en main, hébergée en France.",
    tag: "Recommandé",
    price: "Sur mesure",
    priceLead:
      "Un tarif adapté à votre volume de demandes et à la taille de votre entreprise.",
    features: [
      "Demandes illimitées",
      "Fichiers illisibles pour quiconque d'autre",
      "Vérification de l'identité des officiers",
      "Archives scellées et horodatées",
      "Registre conforme à la CNIL",
      "Support 7j/7",
      "Hébergement en France (OVHcloud)",
      "Abonnement annuel, lissé chaque mois",
    ],
    cta: "Demander un accès",
  },
  creators: {
    badge: "L'équipe fondatrice",
    title: "Les Bâtisseurs de LexaSafe",
    subtitle:
      "Deux étudiants français en BTS, bâtisseurs d'une souveraineté numérique sans concession.",
    quote: "« Nous tenions vraiment à coeur le fait que ce projet soit Francais »",
    discover: "Découvrir les profils",
    contactPrompt: "Une question, un partenariat ou une demande presse ?",
    contactCta: "Contacter les fondateurs",
    bios: {
      "0xzEus":
        "Étudiant en BTS passionné de cybersécurité. Anticipe les failles pour blinder la plateforme et maîtrise les lois cyber (e-Evidence, CPP, RGPD).",
      Tueexiz:
        "Président et développeur en chef de LexaSafe. Architecture la passerelle souveraine pour simplifier la justice aux normes e-Evidence.",
    },
  },
  faq: {
    badge: "Questions fréquentes",
    title: "Tout savoir sur LexaSafe",
    items: [
      {
        question: "Est-ce que LexaSafe peut lire nos fichiers ?",
        answer:
          "Non. Les fichiers sont chiffrés sur votre ordinateur avant l'envoi. Seul l'officier destinataire peut les ouvrir. Même LexaSafe ne peut pas les lire.",
      },
      {
        question: "Pourquoi ne pas simplement envoyer un e-mail ?",
        answer:
          "Un e-mail ne prouve pas que l'expéditeur est vraiment un policier. LexaSafe vérifie l'identité de chaque officier et conserve une preuve d'envoi opposable.",
      },
      {
        question: "Et si la demande est urgente ?",
        answer:
          "Oui, la plateforme gère les délais courts — y compris les urgences de 8 heures — avec des alertes pour ne rien rater.",
      },
      {
        question: "Où sont hébergées les données ?",
        answer:
          "Uniquement en France, chez OVHcloud. Rien ne transite par des serveurs américains.",
      },
    ],
  },
  access: {
    badge: "Accès souverain",
    title: "Demander un accès",
    subtitle: "Deux parcours, chacun avec les vérifications nécessaires. Choisissez le vôtre.",
    companyEyebrow: "Entreprise · Public / privé",
    companyTitle: "Inscription entreprise & devis",
    companyDesc:
      "Obtenez un devis sur mesure et créez l'accès de votre organisation (DPO, service juridique).",
    companyCta: "Demander un devis",
    opjEyebrow: "Forces de l'ordre · Gratuit",
    opjTitle: "Compte officier",
    opjDesc:
      "Réservé aux officiers de police judiciaire. Vérification de l'e-mail professionnel, du matricule et de l'unité.",
    opjCta: "Créer mon compte officier",
    demoTitle: "Vous préférez voir d'abord ?",
    demoText: "Demandez une démonstration guidée de la plateforme.",
    demoCta: "Voir une démo",
  },
  demo: {
    title: "Demander une démo",
    lead: "Accès LexaSafe pour votre entreprise. Un échange avec notre équipe, sans engagement.",
    success: "Demande enregistrée.",
    successHint: "Nous vous recontactons sous 24 h ouvrées.",
    company: "Entreprise",
    siren: "SIREN (9 chiffres)",
    email: "E-mail",
    phone: "Téléphone",
    message: "Message",
    submit: "Envoyer",
    sending: "Envoi…",
    error: "Impossible d'envoyer la demande. Réessayez ou écrivez à contact@lexasafe.fr",
  },
  notFound: {
    title: "Page introuvable",
    text: "Cette page n'existe pas, ou elle n'est plus disponible.",
    home: "Retour à l'accueil",
    access: "Demander un accès",
  },
};

export type Messages = typeof fr;

export const en: Messages = {
  nav: {
    home: "Home",
    how: "How it works",
    simulator: "Simulator",
    pricing: "Pricing",
    team: "The team",
    login: "Log in",
    cta: "Request access",
    openMenu: "Open menu",
    closeMenu: "Close",
    language: "Language",
    fr: "FR",
    en: "EN",
  },
  common: {
    backHome: "Back to home",
    contact: "Contact",
    product: "Product",
    legal: "Legal",
  },
  footer: {
    blurb:
      "Sovereign gateway for judicial data requests. Hosted in France on OVHcloud SecNumCloud (ANSSI).",
    access: "Request access",
    simulator: "Simulator",
    pricing: "Pricing",
    team: "Team",
    faq: "FAQ",
    legal: "Legal notice",
    terms: "Terms & SLA",
    privacy: "Privacy (GDPR)",
    cookies: "Cookie policy",
    rights: "All rights reserved · 100% sovereign · Zero knowledge",
    compliance: "LCEN · GDPR · e-Evidence · Hosted by OVHcloud SAS, Roubaix (FR)",
  },
  hero: {
    kicker: "Sovereign gateway · Judicial requests",
    aria: "Secure and Automate Your Requests",
    lines: [
      { words: ["Secure", "&"] },
      { words: ["Automate"], accent: 0 },
      { words: ["Your", "Requests"] },
    ],
    leadBefore: "The ",
    leadStrong1: "100% French and sovereign",
    leadMid: " standard, built for the ",
    leadStrong2: "new European e-Evidence law",
    leadHost: ". Hosted on ",
    leadStrong3: "OVHcloud SecNumCloud",
    leadZero: " with a ",
    leadStrong4: "zero-knowledge",
    leadEnd: " guarantee.",
    cta: "Request access",
    simulate: "Estimate your savings",
    chips: [
      "100% French sovereign",
      "End-to-end secure channels",
      "European law 2026",
      "Avoid a 2% turnover fine",
    ],
    stats: [
      { title: "Faster", sub: "Immediate processing" },
      { title: "100%", sub: "Hosted in France" },
      { title: "0", subTitle: "Frauds", sub: "No fraud gets through" },
    ],
  },
  workflow: {
    badge: "3 steps",
    title: "How LexaSafe works",
    steps: [
      {
        title: "The officer sends the request",
        text: "The officer files the official request on LexaSafe. It is free for law enforcement.",
      },
      {
        title: "We check it is really them",
        text: "LexaSafe confirms the officer's identity and blocks impersonators. Your files stay unreadable — including to us.",
      },
      {
        title: "You send a sealed file",
        text: "Your company generates the archive in one click, time-stamped and sealed, ready to hand over.",
      },
    ],
  },
  advantages: {
    badge: "Why LexaSafe",
    title: "Why choose LexaSafe?",
    items: [
      {
        title: "Unbreakable security",
        text: "Your files are encrypted end to end: nobody else can read them.",
      },
      {
        title: "100% sovereign",
        text: "Hosted in France on OVHcloud. Your data does not transit through the United States.",
      },
      {
        title: "Fines avoided",
        text: "You reply on time and never hand data to an impostor.",
      },
    ],
  },
  dangers: {
    badge: "Risks you avoid",
    title: "What happens if a request is not secured",
    items: [
      {
        badge: "Fine",
        title: "Up to 2% of your turnover",
        text: "Sending data to a fake officer is a serious breach. The fine can reach 2% of worldwide turnover.",
      },
      {
        badge: "Scam",
        title: "Fake officers already exist",
        text: "Fraudsters impersonate police officers to steal customer data. Without verification, the risk never goes away.",
      },
      {
        badge: "Urgency",
        title: "Sometimes you only have 8 hours",
        text: "Urgent requests can require an answer in under 8 hours. Delay can expose your executives.",
      },
    ],
  },
  calculator: {
    badge: "Simulator",
    title: "What does this cost you today?",
    subtitle: "Two sliders. A clear view of the risk and the time you can save — no jargon.",
    revenue: "Your company's turnover",
    revenueAria: "Turnover",
    sme: "Small business",
    mid: "Mid-size",
    large: "Large group",
    volume: "Police requests per year",
    volumeAria: "Number of requests",
    fineLabel: "Possible fine",
    fineHint: "If data goes to the wrong person",
    severe: "In the most serious cases: up to {amount}",
    refusal: "If you refuse a request without a valid reason: {amount}",
    hours: "Time saved each year",
    savings: "Money saved each year",
    footnote: "Estimates based on GDPR and French law.",
  },
  pricing: {
    badge: "Plan",
    title: "Sovereign subscription",
    subtitle: "The turnkey gateway, hosted in France.",
    tag: "Recommended",
    price: "Custom",
    priceLead: "Pricing fitted to your request volume and company size.",
    features: [
      "Unlimited requests",
      "Files unreadable to anyone else",
      "Officer identity checks",
      "Sealed, time-stamped archives",
      "CNIL-ready register",
      "Support 7 days a week",
      "Hosted in France (OVHcloud)",
      "Annual plan, billed monthly",
    ],
    cta: "Request access",
  },
  creators: {
    badge: "Founding team",
    title: "The builders of LexaSafe",
    subtitle: "Two French BTS students, building uncompromising digital sovereignty.",
    quote: "“We really cared about this project being French.”",
    discover: "See their profiles",
    contactPrompt: "A question, a partnership or a press request?",
    contactCta: "Contact the founders",
    bios: {
      "0xzEus":
        "BTS student passionate about cybersecurity. Anticipates flaws to harden the platform and knows the cyber rules (e-Evidence, criminal procedure, GDPR).",
      Tueexiz:
        "President and lead developer of LexaSafe. Designs the sovereign gateway to make justice simpler under e-Evidence.",
    },
  },
  faq: {
    badge: "FAQ",
    title: "Everything about LexaSafe",
    items: [
      {
        question: "Can LexaSafe read our files?",
        answer:
          "No. Files are encrypted on your computer before they are sent. Only the officer can open them. Even LexaSafe cannot read them.",
      },
      {
        question: "Why not just send an email?",
        answer:
          "Email cannot prove the sender is really a police officer. LexaSafe verifies each officer and keeps a legally usable proof of delivery.",
      },
      {
        question: "What if the request is urgent?",
        answer:
          "The platform handles short deadlines — including 8-hour emergencies — with alerts so nothing is missed.",
      },
      {
        question: "Where is the data hosted?",
        answer: "Only in France, on OVHcloud. Nothing transits through US servers.",
      },
    ],
  },
  access: {
    badge: "Sovereign access",
    title: "Request access",
    subtitle: "Two paths, each with the checks required. Pick yours.",
    companyEyebrow: "Company · Public / private",
    companyTitle: "Company signup & quote",
    companyDesc:
      "Get a tailored quote and create access for your organisation (DPO, legal team).",
    companyCta: "Request a quote",
    opjEyebrow: "Law enforcement · Free",
    opjTitle: "Officer account",
    opjDesc:
      "Reserved for judicial police officers. We verify your professional email, badge number and unit.",
    opjCta: "Create my officer account",
    demoTitle: "Prefer to see it first?",
    demoText: "Ask for a guided walkthrough of the platform.",
    demoCta: "See a demo",
  },
  demo: {
    title: "Request a demo",
    lead: "LexaSafe access for your company. A conversation with our team, no commitment.",
    success: "Request saved.",
    successHint: "We will get back to you within 24 business hours.",
    company: "Company",
    siren: "SIREN (9 digits)",
    email: "Email",
    phone: "Phone",
    message: "Message",
    submit: "Send",
    sending: "Sending…",
    error: "Could not send the request. Try again or write to contact@lexasafe.fr",
  },
  notFound: {
    title: "Page not found",
    text: "This page does not exist, or it is no longer available.",
    home: "Back to home",
    access: "Request access",
  },
};

export const messages: Record<Locale, Messages> = { fr, en };

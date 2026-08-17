export type StoryboardScene = {
  id: string;
  title: string;
  duration: string;
  prompt: string;
};

/** Cinematic FR product-demo storyboard — marketing `/` then dashboards OPJ / entreprise. */
export const PRODUCT_DEMO_STORYBOARD: StoryboardScene[] = [
  {
    id: "hero",
    title: "Homepage — titre Syne",
    duration: "3s",
    prompt:
      "Cinematic product demo, luxury SaaS, cream background #FBF8F4, frosted glass floating navbar, huge Syne extra-bold uppercase title in navy #0A2540 with one accent word in French blue #0259DD, slow camera push-in, soft specular highlights on glass, no logos of other brands, photoreal UI mockup of a French legal-tech homepage.",
  },
  {
    id: "workflow",
    title: "Parcours réquisitions",
    duration: "3s",
    prompt:
      "Horizontal scroll of three frosted glass cards on a cream #FBF8F4 desk: OPJ vérifié, Relais entreprise, Archive scellée, French blue #0259DD icons, elegant parallax, cinematic lighting, product UI, 16:9.",
  },
  {
    id: "opj",
    title: "Dashboard OPJ",
    duration: "3s",
    prompt:
      "Premium 2026 dashboard UI, glass sidebar, Syne titles, list of judicial requisitions with public_hash monospace chips and status pills, subtle abstract 3D data-flow in the background (navy wireframe, blue #84AFFB particles), sovereignty motif, cream #FBF8F4, no readable personal data, cinematic orbit.",
  },
  {
    id: "entreprise",
    title: "Dashboard entreprise",
    duration: "3s",
    prompt:
      "Enterprise DPO dashboard, glass panels for organisation, abonnement, conformité RGPD, French blue #0259DD, cream #FBF8F4, calm camera pan, premium product film, sealed archive metaphor, 16:9.",
  },
];

export const PRODUCT_DEMO_PROMPT = [
  "French cinematic product demo of LexaSafe, a sovereign judicial requisition platform.",
  "Shot 1: marketing homepage, cream #FBF8F4, frosted glass navbar, Syne extra-bold navy titles, accent #0259DD, slow push-in.",
  "Shot 2: pinned workflow, three glass cards for OPJ, entreprise, sealed archive, parallax.",
  "Shot 3: OPJ dashboard, glass sidebar, requisition list with hash chips and status pills, subtle 3D secure data-flow, no personal data.",
  "Shot 4: entreprise dashboard, DPO compliance glass panels, souveraineté, calm pan.",
  "Photoreal UI, luxury legal-tech, 16:9, soft audio: restrained electronic pulse and glass clicks, no voiceover of secrets.",
].join(" ");

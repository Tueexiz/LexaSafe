export interface Creator {
  name: string;
  role: string;
  desc: string;
  portrait: string;
  initials: string;
  tags: string[];
  linkedin: string;
  portfolio: string;
  /** CSS background for the bento card */
  cardBackground: string;
}

export const CREATORS: Creator[] = [
  {
    name: "0xzEus",
    role: "Cybersécurité Offensive & Lois Cyber • Co-Fondateur",
    desc: "Étudiant en BTS passionné de cybersécurité. Anticipe les failles pour blinder la plateforme et maîtrise les lois cyber (e-Evidence, CPP, RGPD).",
    portrait: "/portraits/0xzeus_bitmoji.png",
    initials: "0",
    tags: ["Pentest", "e-Evidence", "RGPD"],
    linkedin: "#",
    portfolio: "#",
    cardBackground:
      "radial-gradient(ellipse 80% 70% at 100% 100%, rgba(255,255,255,0.22) 0%, transparent 55%), linear-gradient(155deg, #0259DD 0%, #3D7EF0 42%, #84AFFB 100%)",
  },
  {
    name: "Tueexiz",
    role: "Président & Lead Développeur • Co-Fondateur",
    desc: "Président et développeur en chef de LexaSafe. Architecture la passerelle souveraine pour simplifier la justice aux normes e-Evidence.",
    portrait: "/portraits/tueexiz_bitmoji.png",
    initials: "T",
    tags: ["Architecture", "SecNumCloud", "Next.js"],
    linkedin: "#",
    portfolio: "#",
    cardBackground:
      "radial-gradient(ellipse 80% 70% at 100% 100%, rgba(255,255,255,0.2) 0%, transparent 55%), linear-gradient(155deg, #0A2540 0%, #0259DD 48%, #84AFFB 100%)",
  },
];

export interface Creator {
  name: string;
  role: string;
  desc: string;
  portrait: string;
  initials: string;
}

export const CREATORS: Creator[] = [
  {
    name: "0xzEus",
    role: "Cybersécurité Offensive & Lois Cyber • Co-Fondateur",
    desc: "Étudiant en BTS passionné de cybersécurité. Anticipe les failles pour blinder la plateforme et maîtrise les lois cyber (e-Evidence, CPP, RGPD).",
    portrait: "/portraits/0xzeus_official.png",
    initials: "0",
  },
  {
    name: "Tueexiz",
    role: "Président & Lead Développeur • Co-Fondateur",
    desc: "Président et développeur en chef de LexaSafe. Architecture la passerelle souveraine pour simplifier la justice aux normes e-Evidence.",
    portrait: "/portraits/tueexiz_official.png",
    initials: "T",
  },
];

import { AlertOctagon, AlertTriangle, TimerOff, UserX } from "lucide-react";
import { FadeUp } from "@lexasafe/motion";
import { GlassCard } from "@lexasafe/ui";

const dangers = [
  {
    icon: AlertOctagon,
    badge: "Sanction Maximale",
    title: "Amende de 2% du CA",
    text: "Transmettre des données à un faux policier constitue une violation grave du RGPD, passible d'une amende jusqu'à 2% de votre chiffre d'affaires mondial.",
  },
  {
    icon: UserX,
    badge: "Piratage Actif",
    title: "Attaques par Faux OPJ",
    text: "Des cybercriminels usurpent des identités de policiers pour voler les données de vos clients. Sans vérification cryptographique, le risque d'exfiltration est permanent.",
  },
  {
    icon: TimerOff,
    badge: "Urgence Pénale",
    title: "Délais d'Urgence (8h)",
    text: "Une réquisition urgente exige une réponse en moins de 8 heures. Tout retard expose vos dirigeants à des poursuites.",
  },
];

export function DangersSection() {
  return (
    <section className="border-t border-border-subtle bg-bg-subtle py-24" id="dangers">
      <div className="container mx-auto max-w-6xl px-6">
        <FadeUp>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-pill border border-crimson-border bg-crimson-bg px-4 py-1.5 text-sm font-bold text-crimson-threat">
              <AlertTriangle className="h-4 w-4" />
              Risques Évités pour votre Entreprise
            </div>
            <h2 className="font-display text-3xl font-extrabold text-blue-navy md:text-4xl">
              Les Dangers Réels des Réquisitions Non Sécurisées
            </h2>
          </div>
        </FadeUp>
        <div className="grid gap-6 md:grid-cols-3">
          {dangers.map((d, i) => (
            <FadeUp key={d.title} index={i}>
              <GlassCard className="h-full border-crimson-border/30 bg-white/80">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-crimson-bg text-crimson-threat">
                  <d.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold uppercase text-crimson-threat">{d.badge}</span>
                <h3 className="mt-1 font-display text-lg font-bold text-blue-navy">{d.title}</h3>
                <p className="mt-3 text-sm text-text-secondary">{d.text}</p>
              </GlassCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

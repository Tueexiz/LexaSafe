/**
 * LEXASAFE - CONSOLE SUPER-ADMIN, EDR SOUVERAIN & GESTION DES COMPTES OPJ
 */

// 1. Base des Organisations B2B
const ADMIN_ORGANIZATIONS = [
  { id: "ORG-01", name: "CloudHost SAS", siren: "892 481 029", dpo: "dpo@cloudhost.fr", type: "Hébergeur Cloud", status: "active", reqCount: 142 },
  { id: "ORG-02", name: "PayTech France", siren: "774 120 981", dpo: "compliance@paytech.fr", type: "Fintech / Paiement", status: "active", reqCount: 89 },
  { id: "ORG-03", name: "TelcoMobile SAS", siren: "512 390 011", dpo: "legal@telcomobile.fr", type: "Opérateur Télécom", status: "active", reqCount: 310 },
  { id: "ORG-04", name: "SecureMessagerie SAS", siren: "901 223 445", dpo: "privacy@securemsg.fr", type: "Messagerie Chiffrée", status: "pending", reqCount: 4 }
];

// 2. Base des Comptes OPJ (Forces de l'Ordre & Magistrats)
const OPJ_ACCOUNTS = [
  {
    id: "OPJ-883921",
    name: "Commandant Aurélien V.",
    service: "Section Cybercriminalité - PJ Paris",
    email: "officier.aurelien@interieur.gouv.fr",
    matricule: "#883921 (OPJ Habilité)",
    createdBy: "DPO National (Enrôlement RIE)",
    createdAt: "10/08/2026 09:15",
    certificate: "Carte Agent PKI Valide (Déc. 2027)",
    status: "active",
    statusText: "Accrédité & Actif"
  },
  {
    id: "OPJ-441029",
    name: "Lieutenant Sarah M.",
    service: "Gendarmerie Nationale - SR Versailles",
    email: "sarah.m@gendarmerie.interieur.gouv.fr",
    matricule: "#441029 (OPJ Habilité)",
    createdBy: "Auto-enrôlement Carte Agent",
    createdAt: "11/08/2026 14:22",
    certificate: "Carte Agent PKI Valide (Juin 2028)",
    status: "active",
    statusText: "Accrédité & Actif"
  },
  {
    id: "OPJ-902184",
    name: "Capitaine Alexandre B.",
    service: "DCPJ / Office Central Cyber (OFAC)",
    email: "alexandre.b@interieur.gouv.fr",
    matricule: "#902184",
    createdBy: "Demande en ligne (Portail Démo)",
    createdAt: "12/08/2026 15:40",
    certificate: "En attente de couplage Carte Agent",
    status: "pending",
    statusText: "En Attente de Validation RIE"
  },
  {
    id: "OPJ-74829-FRAUD",
    name: "Prétendu Cpt Marc D.",
    service: "Brigade Inconnue (Usurpation)",
    email: "police.nationale.requisitions-interieur@proton.me",
    matricule: "#74829 (Inconnu MinInt)",
    createdBy: "Origine Externe Suspecte",
    createdAt: "12/08/2026 16:01",
    certificate: "Falsifié / Absent",
    status: "blocked",
    statusText: "Bloqué & Signalé Pharos"
  }
];

// 3. Télémétrie EDR des Connexions Louches
const EDR_THREAT_EVENTS = [
  {
    id: "EDR-EVT-9041",
    ip: "103.145.2.14",
    geo: "AS45102 • Nœud de Sortie Tor (Singapour)",
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Python-Requests/2.31.0 Malicious-Spooler",
    timestamp: "12/08/2026 16:48:02.194 UTC",
    packets: "1 842 paquets (12.8 Mo)",
    fingerprint: "JA3: 771,4865-4866-4867-49195,0-23-65281-10-11,29-23,0 (Empreinte Malveillante)",
    threatLevel: "Critique (Tentative Fausse Réquisition)",
    status: "blocked"
  },
  {
    id: "EDR-EVT-9038",
    ip: "185.220.101.9",
    geo: "AS60729 • Proxy Anonyme",
    ua: "Go-http-client/1.1 Automated-Brute-Force-Tool/v4.2",
    timestamp: "12/08/2026 16:35:18.721 UTC",
    packets: "4 920 paquets (34.2 Mo)",
    fingerprint: "JA3: a0e9f5d6451642183bb4104fb12f4998 • Canvas: 0x882B4F09",
    threatLevel: "Élevé (Brute-Force A2F Détecté)",
    status: "banned"
  },
  {
    id: "EDR-EVT-9029",
    ip: "82.65.19.112",
    geo: "AS12322 • IP Résidentielle (France)",
    ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15",
    timestamp: "12/08/2026 16:12:44.088 UTC",
    packets: "312 paquets (1.4 Mo)",
    fingerprint: "JA3: 771,4865-4866,0-10-11-13,29-23,0 (Poste Non Répéritorié)",
    threatLevel: "Moyen (Connexion OPJ Hors Plage RIE)",
    status: "quarantine"
  }
];

// 4. Base Purges RGPD
const RGPD_PURGE_ITEMS = [
  { id: "PURGE-8812", reqRef: "REQ-2026-OPJ-88102", company: "CloudHost SAS", dateEnd: "12/08/2026 18:00", status: "scheduled", size: "12.4 Mo" },
  { id: "PURGE-8813", reqRef: "REQ-2026-OPJ-88109", company: "PayTech France", dateEnd: "13/08/2026 00:00", status: "scheduled", size: "4.8 Mo" },
  { id: "PURGE-8809", reqRef: "REQ-2026-OPJ-87994", company: "TelcoMobile SAS", dateEnd: "11/08/2026 23:59", status: "purged", size: "0 Ko (Écrasé)" }
];

let activeAdminTab = 'edr';

function switchAdminTab(tabName) {
  activeAdminTab = tabName;
  const navBtns = document.querySelectorAll('.admin-nav-btn');
  navBtns.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const viewEdr = document.getElementById('admin-view-edr');
  const viewOpj = document.getElementById('admin-view-opj');
  const viewOrgs = document.getElementById('admin-view-orgs');
  const viewRgpd = document.getElementById('admin-view-rgpd');

  if (viewEdr) viewEdr.style.display = tabName === 'edr' ? 'block' : 'none';
  if (viewOpj) viewOpj.style.display = tabName === 'opj' ? 'block' : 'none';
  if (viewOrgs) viewOrgs.style.display = tabName === 'organizations' ? 'block' : 'none';
  if (viewRgpd) viewRgpd.style.display = tabName === 'rgpd' ? 'block' : 'none';

  renderAllAdminTables();
  if (window.lucide) window.lucide.createIcons();
}

function renderAllAdminTables() {
  // Render EDR Threats
  const edrTbody = document.getElementById('admin-edr-tbody');
  if (edrTbody) {
    edrTbody.innerHTML = EDR_THREAT_EVENTS.map(evt => {
      let badgeStyle = "background:#fef2f2; color:#D91A2A; border-color:#fecaca;";
      if (evt.status === 'quarantine') badgeStyle = "background:#fffbeb; color:#d97706; border-color:#fde68a;";

      return `
        <tr>
          <td>
            <div style="font-weight:800; color:#0f2b5c; font-size:0.95rem;">${evt.ip}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${evt.geo}</div>
          </td>
          <td>
            <div style="font-size:0.75rem; font-family:monospace; background:#f8fafc; padding:0.35rem 0.5rem; border-radius:4px; border:1px solid #e2e8f0; max-width:280px; word-break:break-all;">
              ${evt.ua}
            </div>
          </td>
          <td>
            <div style="font-size:0.8rem; font-weight:700; color:#0f172a;">${evt.timestamp}</div>
            <div style="font-size:0.75rem; color:#0259DD; font-weight:600;">Volume : ${evt.packets}</div>
          </td>
          <td>
            <div style="font-size:0.72rem; font-family:monospace; background:#eff6ff; color:#1e40af; padding:0.25rem 0.45rem; border-radius:4px; border:1px solid #bfdbfe;">
              ${evt.fingerprint}
            </div>
          </td>
          <td>
            <span class="status-tag" style="${badgeStyle}">
              ${evt.threatLevel}
            </span>
          </td>
          <td>
            <div style="display:flex; gap:0.4rem;">
              <button class="btn btn-secondary btn-sm" onclick="banIp('${evt.ip}')" style="padding:0.3rem 0.6rem; font-size:0.75rem; color:#D91A2A; border-color:#fecaca;">
                Bannir IP
              </button>
              <button class="btn btn-secondary btn-sm" onclick="sendPharosAlert('${evt.id}')" style="padding:0.3rem 0.6rem; font-size:0.75rem;">
                Pharos
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Render OPJ Accounts
  const opjTbody = document.getElementById('admin-opj-tbody');
  if (opjTbody) {
    opjTbody.innerHTML = OPJ_ACCOUNTS.map(opj => {
      let badgeClass = 'status-sealed';
      if (opj.status === 'pending') badgeClass = 'status-pending';
      if (opj.status === 'blocked') badgeClass = 'status-blocked';

      return `
        <tr>
          <td>
            <div style="font-weight:700; color:#0f2b5c;">${opj.name}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${opj.service}</div>
          </td>
          <td style="color:#0259DD; font-weight:600; font-size:0.85rem;">${opj.email}</td>
          <td><span class="trust-pill" style="font-size:0.75rem; padding:0.2rem 0.5rem; background:#eff6ff; color:#1e40af; border-color:#bfdbfe;">${opj.matricule}</span></td>
          <td>
            <div style="font-size:0.8rem; font-weight:600; color:#334155;">${opj.createdBy}</div>
            <div style="font-size:0.72rem; color:var(--text-muted);">${opj.createdAt}</div>
          </td>
          <td>
            <div style="font-size:0.78rem; font-weight:600; color:${opj.status === 'blocked' ? '#D91A2A' : '#059669'};">
              ${opj.certificate}
            </div>
          </td>
          <td>
            <span class="status-tag ${badgeClass}">
              ${opj.statusText}
            </span>
          </td>
          <td>
            <div style="display:flex; gap:0.4rem;">
              ${opj.status === 'pending' ? `
                <button class="btn btn-primary btn-sm" onclick="approveOpjAccount('${opj.id}')" style="padding:0.3rem 0.6rem; font-size:0.75rem;">
                  Valider OPJ
                </button>
              ` : ''}
              ${opj.status === 'active' ? `
                <button class="btn btn-secondary btn-sm" onclick="revokeOpjAccount('${opj.id}')" style="padding:0.3rem 0.6rem; font-size:0.75rem; color:#D91A2A; border-color:#fecaca;">
                  Suspendre
                </button>
              ` : ''}
              ${opj.status === 'blocked' ? `
                <span style="font-size:0.75rem; color:#D91A2A; font-weight:700;">Dossier Transmis Parquet</span>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Render Organizations
  const orgTbody = document.getElementById('admin-org-tbody');
  if (orgTbody) {
    orgTbody.innerHTML = ADMIN_ORGANIZATIONS.map(org => `
      <tr>
        <td style="font-weight:700; color:#0f2b5c;">${org.name}</td>
        <td><span class="hash-badge" style="background:#f1f5f9;">${org.siren}</span></td>
        <td>${org.type}</td>
        <td style="color:#0259DD; font-weight:600;">${org.dpo}</td>
        <td style="font-weight:700;">${org.reqCount}</td>
        <td>
          <span class="status-tag ${org.status === 'active' ? 'status-sealed' : 'status-pending'}">
            ${org.status === 'active' ? 'Accréditée' : 'En Vérification'}
          </span>
        </td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="toggleOrgStatus('${org.id}')">
            ${org.status === 'active' ? 'Suspendre' : 'Valider'}
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Render RGPD Purges
  const rgpdTbody = document.getElementById('admin-rgpd-tbody');
  if (rgpdTbody) {
    rgpdTbody.innerHTML = RGPD_PURGE_ITEMS.map(p => `
      <tr>
        <td style="font-weight:700; color:#0f2b5c;">${p.reqRef}</td>
        <td>${p.company}</td>
        <td><span style="font-weight:600; color:#0f172a;">${p.dateEnd}</span></td>
        <td>${p.size}</td>
        <td>
          <span class="status-tag ${p.status === 'purged' ? 'status-draft' : 'status-pending'}">
            ${p.status === 'purged' ? 'Détruit (Scellé)' : 'Purge Programmée'}
          </span>
        </td>
        <td>
          ${p.status === 'scheduled' ? `
            <button class="btn btn-secondary btn-sm" onclick="forcePurgeItem('${p.id}')" style="color:#D91A2A; border-color:#fecaca;">
              Purger Immédiatement
            </button>
          ` : '<span style="color:#059669; font-size:0.8rem; font-weight:600;">Attestation RGPD Prête</span>'}
        </td>
      </tr>
    `).join('');
  }

  if (window.lucide) window.lucide.createIcons();
}

function banIp(ip) {
  alert(`ACTION EDR : L'adresse IP ${ip} a été bannie définitivement du réseau souverain LexaSafe et inscrite dans le pare-feu ANSSI.`);
}

function sendPharosAlert(eventId) {
  alert(`SIGNALEMENT PHAROS : Les empreintes JA3, IP, User-Agent et paquets de l'événement ${eventId} ont été transmis à l'Office Anti-Cybercriminalité (OFAC).`);
}

function approveOpjAccount(opjId) {
  const opj = OPJ_ACCOUNTS.find(o => o.id === opjId);
  if (!opj) return;
  opj.status = 'active';
  opj.statusText = 'Accrédité & Actif';
  opj.certificate = 'Carte Agent PKI Couplée';
  renderAllAdminTables();
  alert(`Compte de ${opj.name} (${opj.service}) validé avec succès sur l'annuaire RIE.`);
}

function revokeOpjAccount(opjId) {
  const opj = OPJ_ACCOUNTS.find(o => o.id === opjId);
  if (!opj) return;
  opj.status = 'pending';
  opj.statusText = 'Accréditation Suspendue';
  renderAllAdminTables();
  alert(`L'accès de ${opj.name} a été suspendu par le Super-Admin.`);
}

function toggleOrgStatus(orgId) {
  const org = ADMIN_ORGANIZATIONS.find(o => o.id === orgId);
  if (!org) return;
  org.status = org.status === 'active' ? 'pending' : 'active';
  renderAllAdminTables();
  alert(`Statut de ${org.name} mis à jour.`);
}

function forcePurgeItem(purgeId) {
  const p = RGPD_PURGE_ITEMS.find(item => item.id === purgeId);
  if (!p) return;
  p.status = 'purged';
  p.size = '0 Ko (Écrasé)';
  renderAllAdminTables();
  alert(`Purge RGPD exécutée pour le dossier ${p.reqRef}. Fichiers détruits.`);
}

function triggerEmergencyLockdown() {
  const confirmAction = confirm("ATTENTION : Activer le Verrouillage Souverain Air-Gap d'Urgence ? Tous les tunnels de transmission seront temporairement gelés.");
  if (confirmAction) {
    alert("PROTOCOLE AIR-GAP ACTIVÉ : Les coffres-forts sont isolés. Seuls les accès physiques en quorum d'administrateurs sont autorisés.");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderAllAdminTables();

  const navBtns = document.querySelectorAll('.admin-nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab) switchAdminTab(tab);
    });
  });
});

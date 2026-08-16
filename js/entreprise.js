/**
 * LEXASAFE - ESPACE ENTREPRISE & DPO (LOGIQUE JURIDIQUE, CAVIARDAGE & SOUVERAINETÉ)
 */

const ENTERPRISE_REQUISITIONS = [
  {
    id: "REQ-2026-OPJ-99120",
    officer: "Cdt Aurélien V. (PJ Paris)",
    service: "Section Cybercriminalité - Paris",
    isVerified: true,
    verificationBadge: "OFFICIER VÉRIFIÉ (RIE + CARTE AGENT)",
    legalBasis: "Art. 60-2 CPP (Données de Connexion)",
    urgency: "URGENCE e-Evidence (Reste 4h 18min)",
    isUrgent: true,
    status: "pending",
    statusText: "En Attente de Caviardage / Validation",
    targetUser: "Martin DUPUIS (#USR-88219)",
    requestedScope: "Logs IP, sessions de paiement, FAI et identifiant bancaire",
    extractedData: {
      userIP: "185.220.101.4:44320 (Orange Fibre)",
      email: "cible.suspect92@proton.me",
      phone: "+33 6 88 12 49 01",
      accountName: "Martin DUPUIS",
      timestamp: "Du 01/08/2026 00:00 au 10/08/2026 23:59 UTC",
      sha256: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      zipName: "Requisition_99120_Donnees_Scellees_PayTech.zip",
      zipSize: "4.2 Mo"
    }
  },
  {
    id: "REQ-2026-OPJ-99124",
    officer: "Lt Sarah M. (SR Versailles)",
    service: "Gendarmerie Nationale - SR Versailles",
    isVerified: true,
    verificationBadge: "OFFICIER VÉRIFIÉ (ANNUAIRE MINISTÉRIEL)",
    legalBasis: "Art. 77-1-1 CPP (Enquête Préliminaire)",
    urgency: "Délai Régulier (Reste 8 jours)",
    isUrgent: false,
    status: "pending",
    statusText: "En Attente de Validation DPO",
    targetUser: "Boutique Marchande #MKT-4412",
    requestedScope: "Historique des virements SEPA sortants (Juillet-Août 2026)",
    extractedData: {
      userIP: "82.65.19.112",
      email: "finance.marchand@domain.com",
      phone: "+33 7 55 90 12 88",
      accountName: "SAS E-Commerce Global",
      timestamp: "Du 05/08/2026 au 12/08/2026",
      sha256: "4a7c1120e89f2a0198bcde7701fae299104b2049182a0149ff91029481bcde01",
      zipName: "Requisition_99124_Donnees_Scellees_PayTech.zip",
      zipSize: "1.8 Mo"
    }
  },
  {
    id: "REQ-2026-OPJ-98904",
    officer: "Cpt Thomas B. (PJ Lyon)",
    service: "Brigade Financière - Lyon",
    isVerified: true,
    verificationBadge: "OFFICIER VÉRIFIÉ (RIE + CARTE AGENT)",
    legalBasis: "Art. 60-1 CPP (Identification)",
    urgency: "Remis dans les délais",
    isUrgent: false,
    status: "completed",
    statusText: "Scellé & Transmis à l'OPJ",
    targetUser: "Compte Client #USR-10294",
    requestedScope: "État civil et justificatif de domicile",
    extractedData: {
      userIP: "90.84.12.3",
      email: "client.lyon@free.fr",
      phone: "+33 6 11 22 33 44",
      accountName: "Julien VASSEUR",
      timestamp: "Clôturé le 11/08/2026",
      sha256: "c89320e819b5ff02a981cde288104fb99149182a4729104fae201948bcde8812",
      zipName: "Requisition_98904_Archive_Scellee.zip",
      zipSize: "2.1 Mo"
    }
  },
  {
    id: "REQ-2026-SUSPECT-8921",
    officer: "Prétendu Cpt Marc D. (Proton)",
    service: "Brigade Inconnue (Faux Officier)",
    isVerified: false,
    verificationBadge: "FAUX OFFICIER BLOQUÉ (ALERTE LEXASAFE)",
    legalBasis: "Art. 60-1 CPP (Falsifié)",
    urgency: "Attaque Neutralisée",
    isUrgent: false,
    status: "blocked",
    statusText: "Usurpation Bloquée (Amende 2% Évitée)",
    targetUser: "Base Utilisateurs Complète (Phishing)",
    requestedScope: "Tentative d'extorsion de mots de passe et clés d'API",
    extractedData: null
  }
];

let activeEntTab = 'inbox';
let activeEntFilter = 'all';
let isRgpdRedacted = true;

function switchEnterpriseTab(tabName) {
  activeEntTab = tabName;
  const navBtns = document.querySelectorAll('.ent-nav-btn');
  navBtns.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const views = ['inbox', 'redaction', 'registry', 'api', 'security'];
  views.forEach(v => {
    const el = document.getElementById(`ent-view-${v}`);
    if (el) el.style.display = v === tabName ? 'block' : 'none';
  });

  renderEnterpriseTable();
  if (window.lucide) window.lucide.createIcons();
}

function renderEnterpriseTable() {
  const tbody = document.getElementById('tbody-enterprise');
  if (!tbody) return;

  const filtered = ENTERPRISE_REQUISITIONS.filter(item => {
    if (activeEntFilter === 'all') return true;
    if (activeEntFilter === 'urgent') return item.isUrgent;
    if (activeEntFilter === 'pending') return item.status === 'pending';
    if (activeEntFilter === 'completed') return item.status === 'completed';
    if (activeEntFilter === 'blocked') return item.status === 'blocked';
    return true;
  });

  tbody.innerHTML = filtered.map(row => {
    let tagClass = 'status-sealed';
    let iconName = 'check-circle-2';

    if (row.status === 'pending') {
      tagClass = row.isUrgent ? 'status-pending' : 'status-draft';
      iconName = row.isUrgent ? 'zap' : 'clock';
    } else if (row.status === 'blocked') {
      tagClass = 'status-blocked';
      iconName = 'shield-alert';
    }

    return `
      <tr>
        <td style="font-weight:700; color:#0259DD;">${row.id}</td>
        <td>
          <div style="font-weight:600; color:#0f2b5c;">${row.officer}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${row.service}</div>
        </td>
        <td>
          <div style="font-weight:600; font-size:0.85rem; color:#0f172a;">${row.legalBasis}</div>
          <div style="font-size:0.75rem; color:${row.isUrgent ? '#d97706' : 'var(--text-muted)'}; font-weight:${row.isUrgent ? '700' : '500'};">
            ${row.urgency}
          </div>
        </td>
        <td>
          ${row.isVerified ? `
            <span class="trust-pill" style="font-size:0.72rem; padding:0.25rem 0.55rem; background:#ecfdf5; color:#059669; border-color:#a7f3d0;">
              <i data-lucide="shield-check" style="width:12px;height:12px;"></i>
              ${row.verificationBadge}
            </span>
          ` : `
            <span class="trust-pill" style="font-size:0.72rem; padding:0.25rem 0.55rem; background:#fef2f2; color:#D91A2A; border-color:#fecaca;">
              <i data-lucide="shield-x" style="width:12px;height:12px;"></i>
              ${row.verificationBadge}
            </span>
          `}
        </td>
        <td>
          <span class="status-tag ${tagClass}">
            <i data-lucide="${iconName}" style="width:12px;height:12px;"></i>
            ${row.statusText}
          </span>
        </td>
        <td>
          ${row.status === 'pending' ? `
            <button class="btn btn-primary btn-sm" onclick="openEnterpriseModal('${row.id}')" style="padding:0.4rem 0.9rem; font-size:0.78rem;">
              <i data-lucide="file-signature" style="width:13px;height:13px;"></i>
              <span>Traiter &amp; Sceller</span>
            </button>
          ` : row.status === 'completed' ? `
            <button class="btn btn-secondary btn-sm" onclick="openEnterpriseModal('${row.id}')" style="padding:0.4rem 0.9rem; font-size:0.78rem;">
              <i data-lucide="eye" style="width:13px;height:13px;"></i>
              <span>Bordereau</span>
            </button>
          ` : `
            <button class="btn btn-secondary btn-sm" onclick="alert('Dossier d\'usurpation neutralisé transmis aux services de la gendarmerie pour enquête.')" style="padding:0.4rem 0.9rem; font-size:0.78rem; color:#D91A2A;">
              <i data-lucide="info" style="width:13px;height:13px;"></i>
              <span>Rapport EDR</span>
            </button>
          `}
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function openEnterpriseModal(reqId) {
  const item = ENTERPRISE_REQUISITIONS.find(r => r.id === reqId);
  if (!item) return;

  const modal = document.getElementById('modal-enterprise-action');
  const body = document.getElementById('enterprise-modal-body');
  if (!modal || !body) return;

  const data = item.extractedData;
  const isCompleted = item.status === 'completed';

  body.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; border-bottom:1px solid #e2e8f0; padding-bottom:1rem; flex-wrap:wrap; gap:0.75rem;">
      <div>
        <div style="font-size:0.78rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; letter-spacing:0.04em;">Acte Judiciaire Entrant</div>
        <div style="font-size:1.4rem; font-weight:800; color:var(--blue-navy);">${item.id}</div>
        <div style="font-size:0.85rem; color:var(--text-secondary);">${item.officer} • ${item.legalBasis}</div>
      </div>
      <span class="status-tag ${isCompleted ? 'status-sealed' : 'status-pending'}">
        ${item.statusText}
      </span>
    </div>

    <!-- Périmètre demandé par l'officier -->
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1.25rem; margin-bottom:1.25rem;">
      <div style="font-weight:700; color:var(--blue-navy); font-size:0.925rem; margin-bottom:0.35rem; display:flex; align-items:center; gap:0.4rem;">
        <i data-lucide="file-search" style="width:16px;height:16px;color:#0259DD;"></i>
        Périmètre Légal Exigé par l'Officier :
      </div>
      <div style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">
        Cible : <strong>${item.targetUser}</strong><br>
        Données requises : <em>${item.requestedScope}</em>
      </div>
    </div>

    ${data ? `
      <!-- Données extraites avec Caviardage RGPD -->
      <div class="extraction-panel" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:1.25rem; margin-bottom:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
          <div style="font-weight:700; font-size:0.95rem; color:var(--blue-navy); display:flex; align-items:center; gap:0.4rem;">
            <i data-lucide="shield-check" style="width:16px;height:16px;color:#059669;"></i>
            Données Prêtes pour Remise Judiciaire
          </div>
          <button class="btn btn-secondary btn-sm" onclick="toggleModalRedaction('${item.id}')" style="padding:0.35rem 0.75rem; font-size:0.75rem;">
            <i data-lucide="${isRgpdRedacted ? 'eye' : 'eye-off'}" style="width:12px;height:12px;"></i>
            <span>${isRgpdRedacted ? 'Désactiver Caviardage RGPD' : 'Caviardage RGPD Activé'}</span>
          </button>
        </div>

        <div class="extracted-data-grid">
          <div class="extracted-field" style="background:#f8fafc; border:1px solid #e2e8f0;">
            <div class="extracted-label">Titulaire du Compte</div>
            <div class="extracted-val" style="color:#0f2b5c;">${data.accountName}</div>
          </div>
          <div class="extracted-field" style="background:#f8fafc; border:1px solid #e2e8f0;">
            <div class="extracted-label">IP &amp; FAI</div>
            <div class="extracted-val" style="color:#0259DD;">${data.userIP}</div>
          </div>
          <div class="extracted-field" style="background:#f8fafc; border:1px solid #e2e8f0;">
            <div class="extracted-label">Email Client</div>
            <div class="extracted-val" style="color:#0259DD;">${isRgpdRedacted ? 'c•••••••92@proton.me [CAVIARDÉ]' : data.email}</div>
          </div>
          <div class="extracted-field" style="background:#f8fafc; border:1px solid #e2e8f0;">
            <div class="extracted-label">Téléphone Associé</div>
            <div class="extracted-val" style="color:#0259DD;">${isRgpdRedacted ? '+33 6 •• •• 49 01 [CAVIARDÉ]' : data.phone}</div>
          </div>
        </div>

        <div style="margin-top:1rem; padding:0.6rem 0.9rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:9999px; font-size:0.75rem; color:var(--text-secondary); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
          <span style="font-weight:600;">Scellement Cryptographique eIDAS :</span>
          <span class="hash-badge" style="font-size:0.7rem; background:#ecfdf5; color:#065f46; border-color:#a7f3d0;">${data.sha256}</span>
        </div>
      </div>

      <!-- Action de Remise / Scellement -->
      <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:14px; padding:1.25rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
        <div>
          <div style="font-weight:700; color:#065f46; font-size:0.95rem;">${data.zipName}</div>
          <div style="font-size:0.78rem; color:#047857;">Chiffrement E2EE immédiat vers le terminal de l'Officier (${data.zipSize})</div>
        </div>
        ${!isCompleted ? `
          <button class="btn-download-zip" onclick="sealAndSendZip('${item.id}')" style="padding:0.65rem 1.4rem; font-size:0.85rem;">
            <i data-lucide="send"></i>
            <span>Valider &amp; Transmettre à l'OPJ</span>
          </button>
        ` : `
          <span class="status-tag status-sealed"><i data-lucide="check"></i> TRANSMIS SOUS SCELLÉS</span>
        `}
      </div>
    ` : ''}
  `;

  modal.classList.add('active');
  if (window.lucide) window.lucide.createIcons();
}

function toggleModalRedaction(reqId) {
  isRgpdRedacted = !isRgpdRedacted;
  openEnterpriseModal(reqId);
}

function toggleDemoRedaction() {
  const el = document.getElementById('third-party-data-preview');
  const btn = document.getElementById('btn-toggle-demo-redaction');
  if (!el || !btn) return;

  if (el.textContent.includes('exposés')) {
    el.textContent = '[CAVIARDÉ RGPD] Données des tiers anonymisées automatiquement';
    el.style.color = '#059669';
    btn.innerHTML = '<i data-lucide="eye"></i> <span>Désactiver Caviardage</span>';
  } else {
    el.textContent = '3 comptes conjoints et 4 contacts secondaires exposés';
    el.style.color = '#D91A2A';
    btn.innerHTML = '<i data-lucide="eye-off"></i> <span>Activer Caviardage RGPD</span>';
  }
  if (window.lucide) window.lucide.createIcons();
}

function sealAndSendZip(reqId) {
  const item = ENTERPRISE_REQUISITIONS.find(r => r.id === reqId);
  if (!item) return;

  item.status = 'completed';
  item.statusText = "Scellé & Transmis à l'OPJ";
  item.isUrgent = false;

  alert(`Succès : L'archive scellée eIDAS pour ${reqId} a été chiffrée de bout en bout (E2EE) et transmise directement au terminal de l'Officier. Registre légal mis à jour.`);

  const modal = document.getElementById('modal-enterprise-action');
  if (modal) modal.classList.remove('active');

  renderEnterpriseTable();
}

document.addEventListener('DOMContentLoaded', () => {
  renderEnterpriseTable();

  const navBtns = document.querySelectorAll('.ent-nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab) switchEnterpriseTab(tab);
    });
  });

  const filterBtns = document.querySelectorAll('.ent-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeEntFilter = btn.getAttribute('data-filter');
      renderEnterpriseTable();
    });
  });
});

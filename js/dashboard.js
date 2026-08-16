/**
 * LEXASAFE - LOGIQUE DU DASHBOARD (EXTRACTION, ARCHIVES .ZIP & MODE CAVIARDAGE RGPD)
 */

const REQUISITIONS_DATABASE = [
  {
    id: "REQ-2026-OPJ-99120",
    officer: "Cdt Aurélien V. (PJ Paris)",
    service: "Section Cybercriminalité - Paris",
    company: "CloudHost SAS",
    legalBasis: "Art. 60-2 CPP (Données de Connexion)",
    status: "received",
    statusText: "Réponse Reçue (.ZIP Prêt)",
    time: "Il y a 10 min",
    extractedData: {
      userIP: "185.220.101.4 (Port 44320)",
      isp: "Orange France Fibre (AS3215)",
      email: "cible.suspect92@proton.me",
      phone: "+33 6 88 12 49 01",
      accountName: "Martin DUPUIS",
      timestamp: "Du 01/08/2026 00:00 au 10/08/2026 23:59 UTC",
      sha256: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      zipName: "Requisition_99120_Donnees_Scellees_CloudHost.zip",
      zipSize: "4.2 Mo"
    }
  },
  {
    id: "REQ-2026-OPJ-99124",
    officer: "Lt Sarah M. (SR Versailles)",
    service: "Gendarmerie Nationale - SR Versailles",
    company: "PayTech France",
    legalBasis: "Art. 77-1-1 CPP (Enquête Préliminaire)",
    status: "in_progress",
    statusText: "En cours (Caviardage DPO)",
    time: "Il y a 35 min",
    extractedData: {
      userIP: "82.65.19.112",
      isp: "Free SAS",
      email: "paiement.verif@domain.com",
      phone: "+33 7 55 90 12 88",
      accountName: "En cours d'extraction...",
      timestamp: "Du 05/08/2026 au 12/08/2026",
      sha256: "En attente de scellement...",
      zipName: null,
      zipSize: null
    }
  },
  {
    id: "REQ-2026-DRAFT-003",
    officer: "Cdt Aurélien V. (PJ Paris)",
    service: "Section Cybercriminalité - Paris",
    company: "MessagerieCrypt SAS",
    legalBasis: "Art. 60-1 CPP (Identification)",
    status: "draft",
    statusText: "Brouillon (À signer PKI)",
    time: "Créé il y a 2h",
    extractedData: null
  },
  {
    id: "REQ-2026-SUSPECT-8921",
    officer: "Prétendu Cpt Marc D. (Proton)",
    service: "Brigade Inconnue (Faux Officier)",
    company: "FintechPay SAS",
    legalBasis: "Art. 60-1 CPP (Falsifié)",
    status: "blocked",
    statusText: "Usurpation Bloquée",
    time: "Hier 18:40",
    extractedData: {
      userIP: "103.145.2.14 (Tor Exit Node)",
      isp: "Inconnu / Proxy Malveillant",
      email: "police.nationale.requisitions-interieur@proton.me",
      phone: "Non fourni (Phishing)",
      accountName: "ATTENTION : TENTATIVE D'EXTORSION DE MOTS DE PASSE",
      timestamp: "Alerte générée automatiquement",
      sha256: "SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      zipName: null,
      zipSize: null
    }
  }
];

let activeTab = 'overview';
let activeFilter = 'all';
let isRgpdRedacted = false;

function switchDashboardTab(tabName) {
  activeTab = tabName;
  const tabBtns = document.querySelectorAll('.dash-nav-btn');
  tabBtns.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const viewOverview = document.getElementById('view-overview');
  const viewRequisitions = document.getElementById('view-requisitions');
  const viewSettings = document.getElementById('view-settings');

  if (viewOverview) viewOverview.style.display = tabName === 'overview' ? 'block' : 'none';
  if (viewRequisitions) viewRequisitions.style.display = tabName === 'requisitions' ? 'block' : 'none';
  if (viewSettings) viewSettings.style.display = tabName === 'settings' ? 'block' : 'none';

  renderRequisitionTable();
  if (window.lucide) window.lucide.createIcons();
}

function renderRequisitionTable() {
  const tbodyOverview = document.getElementById('tbody-overview');
  const tbodyRequisitions = document.getElementById('tbody-requisitions');

  const filtered = REQUISITIONS_DATABASE.filter(item => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  const rowsHtml = filtered.map(row => {
    let tagClass = 'status-sealed';
    let iconName = 'check-circle-2';

    if (row.status === 'in_progress') {
      tagClass = 'status-pending';
      iconName = 'clock';
    } else if (row.status === 'draft') {
      tagClass = 'status-draft';
      iconName = 'file-edit';
    } else if (row.status === 'blocked') {
      tagClass = 'status-blocked';
      iconName = 'shield-alert';
    }

    const hasZip = row.status === 'received' && row.extractedData?.zipName;

    return `
      <tr>
        <td style="font-weight:700; color:#0259DD;">${row.id}</td>
        <td>
          <div style="font-weight:600; color:#0f2b5c;">${row.officer}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${row.service}</div>
        </td>
        <td style="font-weight:600; color:#0f172a;">${row.company}</td>
        <td><span class="trust-pill" style="font-size:0.75rem; padding:0.2rem 0.5rem; background:#eff6ff; color:#1e40af; border-color:#bfdbfe;">${row.legalBasis}</span></td>
        <td>
          <span class="status-tag ${tagClass}">
            <i data-lucide="${iconName}" style="width:12px;height:12px;"></i>
            ${row.statusText}
          </span>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn btn-secondary btn-sm" onclick="openExtractionModal('${row.id}')" style="padding:0.4rem 0.85rem; font-size:0.78rem; display:inline-flex; align-items:center; gap:0.35rem; border-radius:9999px;">
              <i data-lucide="eye" style="width:13px;height:13px;"></i>
              <span>Consulter</span>
            </button>
            ${hasZip ? `
              <button class="btn-download-zip" onclick="triggerZipDownload('${row.id}')" title="Télécharger le fichier .ZIP officiel">
                <i data-lucide="download" style="width:13px;height:13px;"></i>
                <span>.ZIP</span>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (tbodyOverview) tbodyOverview.innerHTML = rowsHtml;
  if (tbodyRequisitions) tbodyRequisitions.innerHTML = rowsHtml;

  if (window.lucide) window.lucide.createIcons();
}

function openExtractionModal(reqId) {
  const item = REQUISITIONS_DATABASE.find(r => r.id === reqId);
  if (!item) return;

  const modal = document.getElementById('modal-extraction');
  const body = document.getElementById('extraction-modal-body');
  if (!modal || !body) return;

  const data = item.extractedData;

  const displayPhone = isRgpdRedacted && data?.phone ? "+33 6 •• •• 49 01 [CAVIARDÉ RGPD]" : data?.phone;
  const displayEmail = isRgpdRedacted && data?.email ? "c•••••••92@proton.me [CAVIARDÉ RGPD]" : data?.email;

  body.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; border-bottom:1px solid #e2e8f0; padding-bottom:1rem; flex-wrap:wrap; gap:0.75rem;">
      <div style="min-width:0;">
        <div style="font-size:0.78rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; letter-spacing:0.04em;">Référence de Réquisition</div>
        <div style="font-size:1.4rem; font-weight:800; color:var(--blue-navy);">${item.id}</div>
        <div style="font-size:0.85rem; color:var(--text-secondary);">${item.company} • ${item.legalBasis}</div>
      </div>
      <span class="status-tag ${item.status === 'received' ? 'status-sealed' : item.status === 'blocked' ? 'status-blocked' : 'status-pending'}">
        ${item.statusText}
      </span>
    </div>

    ${data ? `
      <!-- Synthèse des données extraites pour le Head of Legal & Officier -->
      <div class="extraction-panel" style="background:#f8fafc; border:1px solid #e2e8f0;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.75rem;">
          <div style="font-weight:700; font-size:0.95rem; color:var(--blue-navy); display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="binary" style="width:16px;height:16px;color:#0259DD;"></i>
            Données Utilisateur Extraites (Conformité e-Evidence & RGPD)
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary btn-sm" onclick="toggleRgpdRedaction('${item.id}')" style="padding:0.35rem 0.75rem; font-size:0.75rem; background:#fff; border-radius:9999px;">
              <i data-lucide="${isRgpdRedacted ? 'eye' : 'eye-off'}" style="width:12px;height:12px;"></i>
              ${isRgpdRedacted ? 'Désactiver Caviardage' : 'Mode Caviardage RGPD'}
            </button>
            <button class="btn btn-secondary btn-sm" onclick="copyExtractedData('${item.id}')" style="padding:0.35rem 0.75rem; font-size:0.75rem; background:#fff; border-radius:9999px;">
              <i data-lucide="copy" style="width:12px;height:12px;"></i>
              Copier
            </button>
          </div>
        </div>

        <div class="extracted-data-grid">
          <div class="extracted-field" style="background:#ffffff; border:1px solid #e2e8f0;">
            <div class="extracted-label">Adresse IP & Port</div>
            <div class="extracted-val" style="color:#0f2b5c;">${data.userIP}</div>
          </div>
          <div class="extracted-field" style="background:#ffffff; border:1px solid #e2e8f0;">
            <div class="extracted-label">Fournisseur d'Accès (FAI)</div>
            <div class="extracted-val" style="color:#0f2b5c;">${data.isp}</div>
          </div>
          <div class="extracted-field" style="background:#ffffff; border:1px solid #e2e8f0;">
            <div class="extracted-label">Identifiant / Titulaire</div>
            <div class="extracted-val" style="color:#0f2b5c;">${data.accountName}</div>
          </div>
          <div class="extracted-field" style="background:#ffffff; border:1px solid #e2e8f0;">
            <div class="extracted-label">Email de Connexion</div>
            <div class="extracted-val" style="color:#0259DD;">${displayEmail}</div>
          </div>
          <div class="extracted-field" style="background:#ffffff; border:1px solid #e2e8f0;">
            <div class="extracted-label">Téléphone Associé</div>
            <div class="extracted-val" style="color:#0259DD;">${displayPhone}</div>
          </div>
          <div class="extracted-field" style="background:#ffffff; border:1px solid #e2e8f0;">
            <div class="extracted-label">Période d'Extraction</div>
            <div class="extracted-val" style="color:#0f2b5c;">${data.timestamp}</div>
          </div>
        </div>

        <div style="margin-top:1rem; padding:0.6rem 0.9rem; background:#ffffff; border:1px solid #e2e8f0; border-radius:9999px; font-size:0.75rem; color:var(--text-secondary); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
          <span style="font-weight:600;">Empreinte Probatoire eIDAS :</span>
          <span class="hash-badge" style="font-size:0.7rem; background:#eff6ff; color:#1e40af; border-color:#bfdbfe;">${data.sha256}</span>
        </div>
      </div>

      ${data.zipName ? `
        <!-- Bloc Archive .ZIP pour la police -->
        <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:16px; padding:1.25rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
          <div style="display:flex; align-items:center; gap:0.85rem; min-width:0;">
            <div style="width:44px;height:44px;border-radius:12px;background:#d1fae5;display:flex;align-items:center;justify-content:center;color:#059669;flex-shrink:0;">
              <i data-lucide="file-archive"></i>
            </div>
            <div style="min-width:0;">
              <div style="font-weight:700; color:#065f46; font-size:0.95rem; word-break:break-all;">${data.zipName}</div>
              <div style="font-size:0.78rem; color:#047857;">Archive scellée eIDAS (${data.zipSize}) avec bordereau légal signé</div>
            </div>
          </div>
          <button class="btn-download-zip" onclick="triggerZipDownload('${item.id}')" style="padding:0.65rem 1.4rem; font-size:0.85rem;">
            <i data-lucide="download"></i>
            <span>Télécharger l'Archive .ZIP</span>
          </button>
        </div>
      ` : ''}
    ` : `
      <div style="text-align:center; padding:2rem; color:var(--text-secondary);">
        <i data-lucide="clock" style="width:36px;height:36px;color:#d97706;margin-bottom:0.5rem;"></i>
        <p>Réquisition en cours d'instruction. Les données et l'archive .ZIP seront déverrouillées dès validation du DPO.</p>
      </div>
    `}
  `;

  modal.classList.add('active');
  if (window.lucide) window.lucide.createIcons();
}

function toggleRgpdRedaction(reqId) {
  isRgpdRedacted = !isRgpdRedacted;
  openExtractionModal(reqId);
}

function triggerZipDownload(reqId) {
  const item = REQUISITIONS_DATABASE.find(r => r.id === reqId);
  const zipName = item?.extractedData?.zipName || `Requisition_${reqId}_Donnees_Scellees.zip`;
  
  let zipUrl = 'assets/downloads/Requisition_99120_Donnees_Scellees_CloudHost.zip';
  if (reqId === 'REQ-2026-99118' || (zipName && zipName.includes('PayTech'))) {
    zipUrl = 'assets/downloads/Requisition_99118_Identite_Bancaire_PayTech.zip';
  } else if (zipName && zipName.includes('CloudHost')) {
    zipUrl = 'assets/downloads/Requisition_99120_Donnees_Scellees_CloudHost.zip';
  }

  const link = document.createElement('a');
  link.href = zipUrl;
  link.download = zipName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function copyExtractedData(reqId) {
  const item = REQUISITIONS_DATABASE.find(r => r.id === reqId);
  if (!item?.extractedData) return;
  const d = item.extractedData;
  const text = `[RÉQUISITION ${item.id}]
IP: ${d.userIP}
FAI: ${d.isp}
Titulaire: ${d.accountName}
Email: ${d.email}
Tél: ${d.phone}
Période: ${d.timestamp}
Empreinte: ${d.sha256}`;

  navigator.clipboard.writeText(text).then(() => {
    alert("Données copiées dans le presse-papiers pour insertion dans LRPN / LRPGN.");
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderRequisitionTable();

  const navBtns = document.querySelectorAll('.dash-nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab) switchDashboardTab(tab);
    });
  });

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      renderRequisitionTable();
    });
  });
});

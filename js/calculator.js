/**
 * LEXASAFE - SIMULATEUR DE GAIN OPÉRATIONNEL & RISQUE JURIDIQUE
 * Calculs basés sur le Code de Procédure Pénale (Art. 60-1 / 60-2),
 * le Règlement Européen e-Evidence et le barème légal RGPD (2% du CA mondial).
 */

function initCalculator() {
  const revSlider = document.getElementById('calc-revenue-slider');
  const volSlider = document.getElementById('calc-volume-slider');

  const revDisplay = document.getElementById('calc-revenue-display');
  const volDisplay = document.getElementById('calc-volume-display');
  const fineDisplay = document.getElementById('calc-fine-display');
  const timeSavedDisplay = document.getElementById('calc-time-saved');
  const costSavingsDisplay = document.getElementById('calc-cost-savings');

  if (!revSlider || !volSlider) return;

  function updateSliderFill(slider) {
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const percentage = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, var(--blue-primary) 0%, var(--blue-primary) ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
  }

  function update() {
    const revenueM = parseFloat(revSlider.value);
    const volume = parseInt(volSlider.value, 10);

    updateSliderFill(revSlider);
    updateSliderFill(volSlider);

    // 1. Amende maximale légale de 2% du CA mondial
    const fineAmount = (revenueM * 1000000) * 0.02;

    // 2. Temps effectif de traitement économisé (3.93 heures par réquisition)
    const hoursSaved = Math.round(volume * 3.93);

    // 3. Économie financière RH directe (65 € / heure juriste / DPO)
    const costSaved = Math.round(hoursSaved * 65);

    if (revDisplay) {
      revDisplay.textContent = revenueM >= 1000 ? `${(revenueM / 1000).toFixed(1)} Md€` : `${revenueM} M€`;
    }

    if (volDisplay) {
      volDisplay.textContent = `${volume} / an`;
    }

    if (fineDisplay) {
      if (fineAmount >= 1000000) {
        fineDisplay.textContent = `${(fineAmount / 1000000).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} M€`;
      } else {
        fineDisplay.textContent = `${Math.round(fineAmount).toLocaleString('fr-FR')} €`;
      }
    }

    if (timeSavedDisplay) {
      timeSavedDisplay.textContent = `${hoursSaved.toLocaleString('fr-FR')} h / an`;
    }

    if (costSavingsDisplay) {
      costSavingsDisplay.textContent = `${costSaved.toLocaleString('fr-FR')} € / an`;
    }
  }

  revSlider.addEventListener('input', update);
  volSlider.addEventListener('input', update);

  update();
}

document.addEventListener('DOMContentLoaded', initCalculator);

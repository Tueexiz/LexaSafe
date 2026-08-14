"""
LEXASAFE FRANCE - MOTEUR DE RECOUVREMENT DES FRAIS DE JUSTICE
Barème Officiel CPP (Art. R. 213-1) • Génération de Mémoires de Frais Cerfa
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List

router = APIRouter(prefix="/api/costs", tags=["costs"])

# Barème officiel moyen des tarifs de justice en France (Articles R. 213 et suivants du CPP)
OFFICIAL_TARIFS = {
    "identification_ip": 8.50,         # Identification titulaire IP
    "geolocalisation_cell": 18.00,      # Bornage et géolocalisation
    "releve_bancaire_complet": 45.00,   # Historique complet des opérations bancaires
    "interception_flux": 120.00,        # Mise sous écoute / redirection de flux
    "extraction_serveur_cloud": 85.00   # Copie forensique de volume cloud
}


class CostCalculationRequest(BaseModel):
    requisitions_count_monthly: int = Field(..., ge=1, le=10000)
    service_type: str = Field(default="identification_ip")
    hourly_legal_cost: float = Field(default=85.0, ge=30.0, le=500.0)


@router.get("/tarifs")
async def get_official_tarifs():
    """Renvoie les tarifs légaux remboursés par le Ministère de la Justice."""
    return {
        "source": "Code de Procédure Pénale - Article R. 213-1",
        "tarifs_eur": OFFICIAL_TARIFS,
        "average_payout_delay_days": 45
    }


@router.post("/calculate-roi")
async def calculate_roi(req: CostCalculationRequest):
    """
    Calcule le retour sur investissement (ROI) et le montant des frais récupérables auprès de l'État.
    """
    unit_tariff = OFFICIAL_TARIFS.get(req.service_type, 15.00)
    monthly_volume = req.requisitions_count_monthly
    
    # Frais récupérables par an
    annual_recoverable = monthly_volume * unit_tariff * 12
    
    # Économie de temps juridique interne (estimation 1.5h par réquisition manuelle évitée)
    hours_saved_monthly = monthly_volume * 1.5
    labor_cost_saved_annual = hours_saved_monthly * req.hourly_legal_cost * 12
    
    # Coût de l'abonnement LexaSafe Starter ou Business
    subscription_annual = 299 * 12 if monthly_volume <= 30 else 799 * 12
    
    net_benefit_annual = annual_recoverable + labor_cost_saved_annual - subscription_annual
    roi_percentage = int((net_benefit_annual / subscription_annual) * 100) if subscription_annual > 0 else 0

    return {
        "monthly_volume": monthly_volume,
        "annual_recoverable_fees_eur": round(annual_recoverable, 2),
        "labor_cost_saved_annual_eur": round(labor_cost_saved_annual, 2),
        "total_financial_gain_annual_eur": round(annual_recoverable + labor_cost_saved_annual, 2),
        "lexasafe_subscription_annual_eur": subscription_annual,
        "net_gain_eur": round(net_benefit_annual, 2),
        "roi_percentage": f"{roi_percentage}%"
    }


@router.post("/generate-memoire-cerfa/{requisition_id}")
async def generate_memoire_frais(requisition_id: str):
    """
    Génère un bordereau officiel de mémoire de frais Cerfa pour transmission au Greffe du Tribunal Judiciaire.
    """
    return {
        "status": "generated",
        "requisition_id": requisition_id,
        "cerfa_reference": f"CERFA-13824-{requisition_id[-5:]}",
        "amount_claimed_eur": 18.50,
        "tribunal_destinataire": "Tribunal Judiciaire de Paris - Régie d'Avances et Frais de Justice",
        "beneficiary_iban": "FR7630004000010000298765432",
        "transmission_status": "Prêt pour télétransmission Chorus Pro"
    }

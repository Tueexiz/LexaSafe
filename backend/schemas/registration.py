from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List, Literal
import re

class OPJRegistration(BaseModel):
    nom: str = Field(..., min_length=2, max_length=100)
    prenom: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    matricule: str = Field(..., min_length=3, max_length=50)
    unite: str = Field(..., min_length=2, max_length=200)
    grade: str = Field(..., min_length=2, max_length=100)
    telephone: str = Field(..., max_length=20)
    reference_procedure: str = Field(default="", max_length=500)
    website: str = Field(default="", max_length=0)  # honeypot : doit rester vide


class EntrepriseRegistration(BaseModel):
    secteur: Literal["prive", "public"]
    entite: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    telephone: str = Field(..., max_length=20)
    contact_nom: str = Field(..., min_length=2, max_length=150)
    contact_fonction: str = Field(..., min_length=2, max_length=150)
    besoin: str = Field(default="", max_length=2000)
    website: str = Field(default="", max_length=0)  # honeypot

    # Secteur privé
    siren: Optional[str] = Field(default=None, max_length=20)
    forme_juridique: Optional[str] = Field(default=None, max_length=100)
    rcs: Optional[str] = Field(default=None, max_length=100)
    volume: Optional[str] = Field(default=None, max_length=100)

    # Secteur public
    type_organisme: Optional[str] = Field(default=None, max_length=100)
    rattachement: Optional[str] = Field(default=None, max_length=255)
    siret: Optional[str] = Field(default=None, max_length=20)
    referent_rgpd: Optional[str] = Field(default=None, max_length=150)
    acte_designation: Optional[str] = Field(default=None, max_length=255)


class AdminReview(BaseModel):
    note: str = Field(default="", max_length=1000)

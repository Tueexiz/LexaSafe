from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
import re

class EmailVerificationRequest(BaseModel):
    email: EmailStr


class OPJAccessRequest(BaseModel):
    nom: str = Field(..., min_length=2, max_length=100)
    prenom: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    matricule_agent: str = Field(..., min_length=3, max_length=50)
    unite: str = Field(..., min_length=2, max_length=200)
    grade: str = Field(..., min_length=2, max_length=100)
    telephone: str = Field(..., max_length=20)



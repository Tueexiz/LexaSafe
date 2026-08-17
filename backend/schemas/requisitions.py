from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
import re

class CreateRequisitionRequest(BaseModel):
    organization_name: str = Field(..., min_length=2, max_length=200)
    legal_basis: str = Field(default="CPP_60_1", pattern="^(CPP_60_1|CPP_60_2|CPP_77_1_1|E_EVIDENCE_2026|URGENCE_8H)$")
    target_identifier: str = Field(..., min_length=3, max_length=255)
    urgency: bool = Field(default=False)
    notes: Optional[str] = Field(default=None, max_length=1000)



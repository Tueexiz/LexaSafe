from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
import re

class DemoRequest(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=255)
    siren: str = Field(..., pattern=r"^\d{9}$")
    email: EmailStr
    phone: str = Field(..., max_length=20)
    message: str = Field(default="", max_length=2000)



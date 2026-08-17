from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    role: Optional[str] = Field(default="opj", pattern="^(opj|enterprise|super_admin)$")

class A2FVerifyRequest(BaseModel):
    challenge_id: str
    totp_code: str = Field(..., min_length=6, max_length=8)

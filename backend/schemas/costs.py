from pydantic import BaseModel, Field

class CostCalculationRequest(BaseModel):
    requisitions_count_monthly: int = Field(..., ge=1, le=10000)
    service_type: str = Field(default="identification_ip")
    hourly_legal_cost: float = Field(default=85.0, ge=30.0, le=500.0)

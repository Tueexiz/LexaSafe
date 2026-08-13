from fastapi import APIRouter, Depends
from routes.auth import get_session
from services.subscription import check_renewal_reminders, create_subscription

router = APIRouter(prefix="/api/subscriptions", tags=["subscriptions"])


@router.post("/notify")
async def trigger_renewal_notifications(session: dict = Depends(get_session)):
    if session.get("role") != "super_admin":
        from fastapi import HTTPException
        raise HTTPException(403, "Accès admin requis")
    result = await check_renewal_reminders()
    return result


@router.get("/status")
async def subscription_status(session: dict = Depends(get_session)):
    return {
        "tier": "standard_saas",
        "billing_status": "active",
        "monthly_equivalent_cents": 100000,
        "annual_price_cents": 1200000,
        "renewal_reminder_sent": False,
    }

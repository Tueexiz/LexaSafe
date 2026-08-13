from datetime import datetime, timezone, timedelta
from db import pool, set_rls_context
from services.mail import send_renewal_email


async def check_renewal_reminders():
    if not pool:
        return {"sent": 0}
    sent = 0
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT s.id, s.current_period_end, o.legal_dpo_email, o.company_name
            FROM subscriptions s
            JOIN organizations o ON s.organization_id = o.id
            WHERE s.billing_status = 'active'
              AND s.renewal_reminder_sent = FALSE
              AND s.current_period_end <= NOW() + INTERVAL '30 days'
        """)
        for row in rows:
            days_left = (row["current_period_end"] - datetime.now(timezone.utc)).days
            if days_left in (30, 7, 1) or days_left <= 30:
                ok = await send_renewal_email(
                    row["legal_dpo_email"], row["company_name"], max(days_left, 1)
                )
                if ok:
                    await conn.execute(
                        "UPDATE subscriptions SET renewal_reminder_sent = TRUE WHERE id = $1",
                        row["id"],
                    )
                    sent += 1
    return {"sent": sent}


async def create_subscription(
    org_id: str,
    tier: str,
    annual_price_cents: int,
) -> dict:
    monthly = annual_price_cents // 12
    now = datetime.now(timezone.utc)
    period_end = now + timedelta(days=365)
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""
            INSERT INTO subscriptions (
                organization_id, tier, annual_price_cents, monthly_equivalent_cents,
                current_period_start, current_period_end
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, monthly_equivalent_cents, billing_status
        """, org_id, tier, annual_price_cents, monthly, now, period_end)
    return dict(row)

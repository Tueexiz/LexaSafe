import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import settings


async def send_email(to: str, subject: str, html_body: str) -> bool:
    if not settings.smtp_user or not settings.smtp_password:
        # Dev mode: log instead of send
        print(f"[SMTP DEV] To: {to} | Subject: {subject}")
        return True

    msg = MIMEMultipart("alternative")
    msg["From"] = settings.smtp_from
    msg["To"] = to
    msg["Subject"] = subject
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_user,
            password=settings.smtp_password,
            start_tls=True,
        )
        return True
    except Exception as e:
        print(f"[SMTP ERROR] {e}")
        return False


async def send_reset_email(to: str, reset_link: str) -> bool:
    html = f"""
    <html><body style="font-family:Inter,sans-serif;">
    <h2>LexaSafe — Réinitialisation de mot de passe</h2>
    <p>Cliquez sur le lien ci-dessous (usage unique, expiration 15 min) :</p>
    <a href="{reset_link}">{reset_link}</a>
    <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    </body></html>
    """
    return await send_email(to, "LexaSafe — Réinitialisation mot de passe", html)


async def send_renewal_email(to: str, company_name: str, days_left: int) -> bool:
    html = f"""
    <html><body style="font-family:Inter,sans-serif;">
    <h2>LexaSafe — Renouvellement d'abonnement</h2>
    <p>L'abonnement de <strong>{company_name}</strong> expire dans <strong>{days_left} jours</strong>.</p>
    <p>Contactez votre DPO ou contact@lexasafe.fr pour renouveler.</p>
    </body></html>
    """
    return await send_email(to, f"LexaSafe — Renouvellement J-{days_left}", html)


async def send_phone_otp(to_email: str, phone: str, otp: str) -> bool:
    html = f"""
    <html><body style="font-family:Inter,sans-serif;">
    <h2>LexaSafe — Validation téléphone</h2>
    <p>Code OTP pour {phone} : <strong>{otp}</strong> (expiration 5 min)</p>
    </body></html>
    """
    return await send_email(to_email, "LexaSafe — Code validation téléphone", html)

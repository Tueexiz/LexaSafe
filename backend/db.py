import asyncpg
from contextlib import asynccontextmanager
from config import settings

pool: asyncpg.Pool | None = None


async def init_db():
    global pool
    pool = await asyncpg.create_pool(settings.database_url, min_size=2, max_size=10)


async def close_db():
    global pool
    if pool:
        await pool.close()


async def get_conn():
    if not pool:
        raise RuntimeError("Database pool not initialized")
    async with pool.acquire() as conn:
        yield conn


async def set_rls_context(conn: asyncpg.Connection, org_id: str | None):
    if org_id:
        await conn.execute("SELECT set_config('app.current_org_id', $1, true)", org_id)
    else:
        await conn.execute("SELECT set_config('app.current_org_id', '', true)")

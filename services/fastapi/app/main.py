from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.exceptions import SakshamException
from app.api.router import api_router


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "SAKSHAM Disaster Response and Relief Coordination "
        "Network - FastAPI Core"
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)


# ============================================================
# CORS CONFIGURATION
# ============================================================
# Allows the React/Vite frontend to run on any local development
# port such as:
#   http://localhost:5173
#   http://localhost:5176
#   http://localhost:5178
#   http://127.0.0.1:5173
# etc.
#
# This avoids CORS problems when Vite automatically changes ports.
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# CUSTOM SAKSHAM EXCEPTION HANDLER
# ============================================================
@app.exception_handler(SakshamException)
async def saksham_exception_handler(
    request: Request,
    exc: SakshamException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.detail,
    )


# ============================================================
# API ROUTES
# ============================================================
# All API routes are mounted under:
# /api/v1
#
# Example:
# /api/v1/incidents
# /api/v1/demands
# /api/v1/resources
# /api/v1/vehicles
# /api/v1/routing/optimize
app.include_router(
    api_router,
    prefix=settings.API_PREFIX,
)


# ============================================================
# ROOT HEALTH CHECK
# ============================================================
@app.get(
    "/health",
    tags=["Health"],
    summary="Root Health Status Check",
)
async def root_health():
    return {
        "status": "ok",
        "service": "saksham-fastapi",
        "version": settings.APP_VERSION,
    }


# ============================================================
# DEVELOPMENT SERVER
# ============================================================
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )
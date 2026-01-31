===== Build Queued at 2026-01-31 21:54:36 / Commit SHA: d16a857 =====

--> FROM docker.io/library/python:3.11-slim@sha256:5be45dbade29bebd6886af6b438fd7e0b4eb7b611f39ba62b430263f82de36d2
DONE 0.0s

--> WORKDIR /app
CACHED

--> RUN apt-get update && apt-get install -y gcc postgresql-client && rm -rf /var/lib/apt/lists/*
CACHED

--> Restoring cache
DONE 2.3s

--> COPY requirements.txt .
DONE 0.0s

--> RUN pip install --no-cache-dir -r requirements.txt
Collecting fastapi==0.109.0 (from -r requirements.txt (line 1))
  Downloading fastapi-0.109.0-py3-none-any.whl.metadata (24 kB)
Collecting uvicorn==0.27.0 (from uvicorn[standard]==0.27.0->-r requirements.txt (line 2))
  Downloading uvicorn-0.27.0-py3-none-any.whl.metadata (6.4 kB)
Collecting sqlmodel==0.0.14 (from -r requirements.txt (line 3))
  Downloading sqlmodel-0.0.14-py3-none-any.whl.metadata (9.8 kB)
Collecting psycopg2-binary==2.9.11 (from -r requirements.txt (line 4))
  Downloading psycopg2_binary-2.9.11-cp311-cp311-manylinux2014_x86_64.manylinux_2_17_x86_64.whl.metadata (4.9 kB)
Collecting python-jose==3.3.0 (from python-jose[cryptography]==3.3.0->-r requirements.txt (line 5))
  Downloading python_jose-3.3.0-py2.py3-none-any.whl.metadata (5.4 kB)
Collecting passlib==1.7.4 (from passlib[bcrypt]==1.7.4->-r requirements.txt (line 6))
  Downloading passlib-1.7.4-py2.py3-none-any.whl.metadata (1.7 kB)
Collecting bcrypt==4.0.1 (from -r requirements.txt (line 7))
  Downloading bcrypt-4.0.1-cp36-abi3-manylinux_2_28_x86_64.whl.metadata (9.0 kB)
Collecting python-multipart==0.0.6 (from -r requirements.txt (line 8))
  Downloading python_multipart-0.0.6-py3-none-any.whl.metadata (2.5 kB)
Collecting alembic==1.13.1 (from -r requirements.txt (line 9))
  Downloading alembic-1.13.1-py3-none-any.whl.metadata (7.4 kB)
Collecting pydantic>=2.10.0 (from pydantic[email]>=2.10.0->-r requirements.txt (line 10))
  Downloading pydantic-2.12.5-py3-none-any.whl.metadata (90 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 90.6/90.6 kB 284.1 MB/s eta 0:00:00
Collecting python-dotenv==1.0.0 (from -r requirements.txt (line 11))
  Downloading python_dotenv-1.0.0-py3-none-any.whl.metadata (21 kB)
Collecting pydantic-settings==2.1.0 (from -r requirements.txt (line 12))
  Downloading pydantic_settings-2.1.0-py3-none-any.whl.metadata (2.9 kB)
Collecting python-json-logger==2.0.7 (from -r requirements.txt (line 13))
  Downloading python_json_logger-2.0.7-py3-none-any.whl.metadata (6.5 kB)
Collecting psutil==5.9.8 (from -r requirements.txt (line 14))
  Downloading psutil-5.9.8-cp36-abi3-manylinux_2_12_x86_64.manylinux2010_x86_64.manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (21 kB)
Collecting cloudinary==1.44.1 (from -r requirements.txt (line 15))
  Downloading cloudinary-1.44.1-py3-none-any.whl.metadata (8.0 kB)
Collecting Pillow==10.2.0 (from -r requirements.txt (line 16))
  Downloading pillow-10.2.0-cp311-cp311-manylinux_2_28_x86_64.whl.metadata (9.7 kB)
Collecting slowapi==0.1.9 (from -r requirements.txt (line 17))
  Downloading slowapi-0.1.9-py3-none-any.whl.metadata (3.0 kB)
Collecting mcp>=1.0.0 (from -r requirements.txt (line 20))
  Downloading mcp-1.26.0-py3-none-any.whl.metadata (89 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 89.5/89.5 kB 397.4 MB/s eta 0:00:00
Collecting resend==0.8.0 (from -r requirements.txt (line 23))
  Downloading resend-0.8.0-py2.py3-none-any.whl.metadata (2.2 kB)
Collecting aiosmtplib==3.0.1 (from -r requirements.txt (line 24))
  Downloading aiosmtplib-3.0.1-py3-none-any.whl.metadata (3.9 kB)
Collecting email-validator==2.1.0 (from -r requirements.txt (line 25))
  Downloading email_validator-2.1.0-py3-none-any.whl.metadata (25 kB)
Collecting openai>=2.9.0 (from -r requirements.txt (line 28))
  Downloading openai-2.16.0-py3-none-any.whl.metadata (29 kB)
Collecting openai-agents>=0.7.0 (from -r requirements.txt (line 29))
  Downloading openai_agents-0.7.0-py3-none-any.whl.metadata (13 kB)
Collecting pytest==7.4.3 (from -r requirements.txt (line 32))
  Downloading pytest-7.4.3-py3-none-any.whl.metadata (7.9 kB)
Collecting pytest-cov==4.1.0 (from -r requirements.txt (line 33))
  Downloading pytest_cov-4.1.0-py3-none-any.whl.metadata (26 kB)
Collecting pytest-asyncio==0.21.1 (from -r requirements.txt (line 34))
  Downloading pytest_asyncio-0.21.1-py3-none-any.whl.metadata (4.0 kB)
Collecting pytest-env==1.1.3 (from -r requirements.txt (line 35))
  Downloading pytest_env-1.1.3-py3-none-any.whl.metadata (5.3 kB)
Collecting httpx==0.25.2 (from -r requirements.txt (line 36))
  Downloading httpx-0.25.2-py3-none-any.whl.metadata (6.9 kB)
Collecting starlette<0.36.0,>=0.35.0 (from fastapi==0.109.0->-r requirements.txt (line 1))
  Downloading starlette-0.35.1-py3-none-any.whl.metadata (5.8 kB)
Collecting typing-extensions>=4.8.0 (from fastapi==0.109.0->-r requirements.txt (line 1))
  Downloading typing_extensions-4.15.0-py3-none-any.whl.metadata (3.3 kB)
Collecting click>=7.0 (from uvicorn==0.27.0->uvicorn[standard]==0.27.0->-r requirements.txt (line 2))
  Downloading click-8.3.1-py3-none-any.whl.metadata (2.6 kB)
Collecting h11>=0.8 (from uvicorn==0.27.0->uvicorn[standard]==0.27.0->-r requirements.txt (line 2))
  Downloading h11-0.16.0-py3-none-any.whl.metadata (8.3 kB)
Collecting SQLAlchemy<2.1.0,>=2.0.0 (from sqlmodel==0.0.14->-r requirements.txt (line 3))
  Downloading sqlalchemy-2.0.46-cp311-cp311-manylinux2014_x86_64.manylinux_2_17_x86_64.manylinux_2_28_x86_64.whl.metadata (9.5 kB)
Collecting ecdsa!=0.15 (from python-jose==3.3.0->python-jose[cryptography]==3.3.0->-r requirements.txt (line 5))
  Downloading ecdsa-0.19.1-py2.py3-none-any.whl.metadata (29 kB)
Collecting rsa (from python-jose==3.3.0->python-jose[cryptography]==3.3.0->-r requirements.txt (line 5))
  Downloading rsa-4.9.1-py3-none-any.whl.metadata (5.6 kB)
Collecting pyasn1 (from python-jose==3.3.0->python-jose[cryptography]==3.3.0->-r requirements.txt (line 5))
  Downloading pyasn1-0.6.2-py3-none-any.whl.metadata (8.4 kB)
Collecting Mako (from alembic==1.13.1->-r requirements.txt (line 9))
  Downloading mako-1.3.10-py3-none-any.whl.metadata (2.9 kB)
Collecting six (from cloudinary==1.44.1->-r requirements.txt (line 15))
  Downloading six-1.17.0-py2.py3-none-any.whl.metadata (1.7 kB)
Collecting urllib3>=1.26.5 (from cloudinary==1.44.1->-r requirements.txt (line 15))
  Downloading urllib3-2.6.3-py3-none-any.whl.metadata (6.9 kB)
Collecting certifi (from cloudinary==1.44.1->-r requirements.txt (line 15))
  Downloading certifi-2026.1.4-py3-none-any.whl.metadata (2.5 kB)
Collecting limits>=2.3 (from slowapi==0.1.9->-r requirements.txt (line 17))
  Downloading limits-5.6.0-py3-none-any.whl.metadata (10 kB)
Collecting requests==2.31.0 (from resend==0.8.0->-r requirements.txt (line 23))
  Downloading requests-2.31.0-py3-none-any.whl.metadata (4.6 kB)
Collecting dnspython>=2.0.0 (from email-validator==2.1.0->-r requirements.txt (line 25))
  Downloading dnspython-2.8.0-py3-none-any.whl.metadata (5.7 kB)
Collecting idna>=2.0.0 (from email-validator==2.1.0->-r requirements.txt (line 25))
  Downloading idna-3.11-py3-none-any.whl.metadata (8.4 kB)
Collecting iniconfig (from pytest==7.4.3->-r requirements.txt (line 32))
  Downloading iniconfig-2.3.0-py3-none-any.whl.metadata (2.5 kB)
Collecting packaging (from pytest==7.4.3->-r requirements.txt (line 32))
  Downloading packaging-26.0-py3-none-any.whl.metadata (3.3 kB)
Collecting pluggy<2.0,>=0.12 (from pytest==7.4.3->-r requirements.txt (line 32))
  Downloading pluggy-1.6.0-py3-none-any.whl.metadata (4.8 kB)
Collecting coverage>=5.2.1 (from coverage[toml]>=5.2.1->pytest-cov==4.1.0->-r requirements.txt (line 33))
  Downloading coverage-7.13.2-cp311-cp311-manylinux1_x86_64.manylinux_2_28_x86_64.manylinux_2_5_x86_64.whl.metadata (8.5 kB)
Collecting anyio (from httpx==0.25.2->-r requirements.txt (line 36))
  Downloading anyio-4.12.1-py3-none-any.whl.metadata (4.3 kB)
Collecting httpcore==1.* (from httpx==0.25.2->-r requirements.txt (line 36))
  Downloading httpcore-1.0.9-py3-none-any.whl.metadata (21 kB)
Collecting sniffio (from httpx==0.25.2->-r requirements.txt (line 36))
  Downloading sniffio-1.3.1-py3-none-any.whl.metadata (3.9 kB)
Collecting cryptography>=3.4.0 (from python-jose[cryptography]==3.3.0->-r requirements.txt (line 5))
  Downloading cryptography-46.0.4-cp311-abi3-manylinux_2_34_x86_64.whl.metadata (5.7 kB)
Collecting httptools>=0.5.0 (from uvicorn[standard]==0.27.0->-r requirements.txt (line 2))
  Downloading httptools-0.7.1-cp311-cp311-manylinux1_x86_64.manylinux_2_28_x86_64.manylinux_2_5_x86_64.whl.metadata (3.5 kB)
Collecting pyyaml>=5.1 (from uvicorn[standard]==0.27.0->-r requirements.txt (line 2))
  Downloading pyyaml-6.0.3-cp311-cp311-manylinux2014_x86_64.manylinux_2_17_x86_64.manylinux_2_28_x86_64.whl.metadata (2.4 kB)
Collecting uvloop!=0.15.0,!=0.15.1,>=0.14.0 (from uvicorn[standard]==0.27.0->-r requirements.txt (line 2))
  Downloading uvloop-0.22.1-cp311-cp311-manylinux2014_x86_64.manylinux_2_17_x86_64.manylinux_2_28_x86_64.whl.metadata (4.9 kB)
Collecting watchfiles>=0.13 (from uvicorn[standard]==0.27.0->-r requirements.txt (line 2))
  Downloading watchfiles-1.1.1-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (4.9 kB)
Collecting websockets>=10.4 (from uvicorn[standard]==0.27.0->-r requirements.txt (line 2))
  Downloading websockets-16.0-cp311-cp311-manylinux1_x86_64.manylinux_2_28_x86_64.manylinux_2_5_x86_64.whl.metadata (6.8 kB)
Collecting charset-normalizer<4,>=2 (from requests==2.31.0->resend==0.8.0->-r requirements.txt (line 23))
  Downloading charset_normalizer-3.4.4-cp311-cp311-manylinux2014_x86_64.manylinux_2_17_x86_64.manylinux_2_28_x86_64.whl.metadata (37 kB)
Collecting annotated-types>=0.6.0 (from pydantic>=2.10.0->pydantic[email]>=2.10.0->-r requirements.txt (line 10))
  Downloading annotated_types-0.7.0-py3-none-any.whl.metadata (15 kB)
Collecting pydantic-core==2.41.5 (from pydantic>=2.10.0->pydantic[email]>=2.10.0->-r requirements.txt (line 10))
  Downloading pydantic_core-2.41.5-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (7.3 kB)
Collecting typing-inspection>=0.4.2 (from pydantic>=2.10.0->pydantic[email]>=2.10.0->-r requirements.txt (line 10))
  Downloading typing_inspection-0.4.2-py3-none-any.whl.metadata (2.6 kB)
Collecting httpx-sse>=0.4 (from mcp>=1.0.0->-r requirements.txt (line 20))
  Downloading httpx_sse-0.4.3-py3-none-any.whl.metadata (9.7 kB)
INFO: pip is looking at multiple versions of mcp to determine which version is compatible with other requirements. This could take a while.
Collecting mcp>=1.0.0 (from -r requirements.txt (line 20))
  Downloading mcp-1.25.0-py3-none-any.whl.metadata (89 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 89.5/89.5 kB 409.0 MB/s eta 0:00:00
  Downloading mcp-1.24.0-py3-none-any.whl.metadata (89 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 89.5/89.5 kB 404.4 MB/s eta 0:00:00
  Downloading mcp-1.23.3-py3-none-any.whl.metadata (89 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 89.3/89.3 kB 396.2 MB/s eta 0:00:00
  Downloading mcp-1.23.2-py3-none-any.whl.metadata (89 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 89.3/89.3 kB 392.2 MB/s eta 0:00:00
  Downloading mcp-1.23.1-py3-none-any.whl.metadata (88 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 88.5/88.5 kB 404.3 MB/s eta 0:00:00
  Downloading mcp-1.23.0-py3-none-any.whl.metadata (88 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 88.5/88.5 kB 383.9 MB/s eta 0:00:00
  Downloading mcp-1.22.0-py3-none-any.whl.metadata (85 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 85.9/85.9 kB 315.5 MB/s eta 0:00:00
INFO: pip is still looking at multiple versions of mcp to determine which version is compatible with other requirements. This could take a while.
  Downloading mcp-1.21.2-py3-none-any.whl.metadata (85 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 85.3/85.3 kB 398.9 MB/s eta 0:00:00
  Downloading mcp-1.21.1-py3-none-any.whl.metadata (85 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 85.3/85.3 kB 401.9 MB/s eta 0:00:00
  Downloading mcp-1.21.0-py3-none-any.whl.metadata (85 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 85.2/85.2 kB 389.7 MB/s eta 0:00:00
  Downloading mcp-1.20.0-py3-none-any.whl.metadata (85 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 85.2/85.2 kB 148.3 MB/s eta 0:00:00
  Downloading mcp-1.19.0-py3-none-any.whl.metadata (85 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 85.1/85.1 kB 387.8 MB/s eta 0:00:00
INFO: This is taking longer than usual. You might need to provide the dependency resolver with stricter constraints to reduce runtime. See https://pip.pypa.io/warnings/backtracking for guidance. If you want to abort this run, press Ctrl + C.
  Downloading mcp-1.18.0-py3-none-any.whl.metadata (80 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 80.4/80.4 kB 395.5 MB/s eta 0:00:00
  Downloading mcp-1.17.0-py3-none-any.whl.metadata (80 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 80.3/80.3 kB 412.9 MB/s eta 0:00:00
  Downloading mcp-1.16.0-py3-none-any.whl.metadata (80 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 80.4/80.4 kB 378.0 MB/s eta 0:00:00
  Downloading mcp-1.15.0-py3-none-any.whl.metadata (80 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 80.4/80.4 kB 403.0 MB/s eta 0:00:00
  Downloading mcp-1.14.1-py3-none-any.whl.metadata (75 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 75.5/75.5 kB 393.9 MB/s eta 0:00:00
  Downloading mcp-1.14.0-py3-none-any.whl.metadata (75 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 75.5/75.5 kB 381.2 MB/s eta 0:00:00
  Downloading mcp-1.13.1-py3-none-any.whl.metadata (74 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 74.7/74.7 kB 385.1 MB/s eta 0:00:00
  Downloading mcp-1.13.0-py3-none-any.whl.metadata (68 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 68.7/68.7 kB 382.3 MB/s eta 0:00:00
  Downloading mcp-1.12.4-py3-none-any.whl.metadata (68 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 68.2/68.2 kB 378.6 MB/s eta 0:00:00
  Downloading mcp-1.12.3-py3-none-any.whl.metadata (60 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 61.0/61.0 kB 378.2 MB/s eta 0:00:00
  Downloading mcp-1.12.2-py3-none-any.whl.metadata (60 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 61.0/61.0 kB 329.9 MB/s eta 0:00:00
  Downloading mcp-1.12.1-py3-none-any.whl.metadata (60 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 61.0/61.0 kB 363.4 MB/s eta 0:00:00
  Downloading mcp-1.12.0-py3-none-any.whl.metadata (60 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 61.0/61.0 kB 376.9 MB/s eta 0:00:00
  Downloading mcp-1.11.0-py3-none-any.whl.metadata (44 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 44.7/44.7 kB 322.3 MB/s eta 0:00:00
  Downloading mcp-1.10.1-py3-none-any.whl.metadata (40 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 40.1/40.1 kB 13.2 MB/s eta 0:00:00
  Downloading mcp-1.10.0-py3-none-any.whl.metadata (40 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 40.1/40.1 kB 247.0 MB/s eta 0:00:00
  Downloading mcp-1.9.4-py3-none-any.whl.metadata (28 kB)
  Downloading mcp-1.9.3-py3-none-any.whl.metadata (28 kB)
  Downloading mcp-1.9.2-py3-none-any.whl.metadata (28 kB)
  Downloading mcp-1.9.1-py3-none-any.whl.metadata (27 kB)
  Downloading mcp-1.9.0-py3-none-any.whl.metadata (26 kB)
  Downloading mcp-1.8.1-py3-none-any.whl.metadata (25 kB)
  Downloading mcp-1.8.0-py3-none-any.whl.metadata (25 kB)
  Downloading mcp-1.7.1-py3-none-any.whl.metadata (21 kB)
  Downloading mcp-1.7.0-py3-none-any.whl.metadata (21 kB)
  Downloading mcp-1.6.0-py3-none-any.whl.metadata (20 kB)
  Downloading mcp-1.5.0-py3-none-any.whl.metadata (20 kB)
  Downloading mcp-1.4.1-py3-none-any.whl.metadata (18 kB)
  Downloading mcp-1.4.0-py3-none-any.whl.metadata (18 kB)
  Downloading mcp-1.3.0-py3-none-any.whl.metadata (18 kB)
  Downloading mcp-1.2.1-py3-none-any.whl.metadata (15 kB)
  Downloading mcp-1.2.0-py3-none-any.whl.metadata (15 kB)
  Downloading mcp-1.1.3-py3-none-any.whl.metadata (14 kB)
  Downloading mcp-1.1.2-py3-none-any.whl.metadata (14 kB)
  Downloading mcp-1.1.1-py3-none-any.whl.metadata (14 kB)
  Downloading mcp-1.1.0-py3-none-any.whl.metadata (14 kB)
  Downloading mcp-1.0.0-py3-none-any.whl.metadata (13 kB)
ERROR: Cannot install -r requirements.txt (line 20) and httpx==0.25.2 because these package versions have conflicting dependencies.

The conflict is caused by:
    The user requested httpx==0.25.2
    mcp 1.26.0 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.25.0 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.24.0 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.23.3 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.23.2 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.23.1 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.23.0 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.22.0 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.21.2 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.21.1 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.21.0 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.20.0 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.19.0 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.18.0 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.17.0 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.16.0 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.15.0 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.14.1 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.14.0 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.13.1 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.13.0 depends on httpx>=0.27.1
    The user requested httpx==0.25.2
    mcp 1.12.4 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.12.3 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.12.2 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.12.1 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.12.0 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.11.0 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.10.1 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.10.0 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.9.4 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.9.3 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.9.2 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.9.1 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.9.0 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.8.1 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.8.0 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.7.1 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.7.0 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.6.0 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.5.0 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.4.1 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.4.0 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.3.0 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.2.1 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.2.0 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.1.3 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.1.2 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.1.1 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.1.0 depends on httpx>=0.27
    The user requested httpx==0.25.2
    mcp 1.0.0 depends on httpx>=0.27

To fix this you could try to:
1. loosen the range of package versions you've specified
2. remove package versions to allow pip attempt to solve the dependency conflict

ERROR: ResolutionImpossible: for help visit https://pip.pypa.io/en/latest/topics/dependency-resolution/#dealing-with-dependency-conflicts

[notice] A new release of pip is available: 24.0 -> 26.0
[notice] To update, run: pip install --upgrade pip

--> ERROR: process "/bin/sh -c pip install --no-cache-dir -r requirements.txt" did not complete successfully: exit code: 1
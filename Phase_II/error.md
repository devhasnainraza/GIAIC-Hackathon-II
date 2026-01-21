===== Build Queued at 2026-01-21 18:25:38 / Commit SHA: 64da653 =====

--------------------
   6 |     # Install system dependencies
   7 |     RUN apt-get update && apt-get install -y /
   8 | >>>     gcc /
   9 |         postgresql-client /
  10 |         && rm -rf /var/lib/apt/lists/*
--------------------
error: failed to solve: dockerfile parse error on line 8: unknown instruction: gcc
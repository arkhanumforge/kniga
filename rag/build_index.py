# -*- coding: utf-8 -*-
"""Собрать простой локальный индекс по md-файлам книги (без API)."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = Path(__file__).resolve().parent / "index.json"

# Отдельные главы, включая главу 1; без Плана лора. Старый фильтр ещё не отделяет альтернативы и планы (этап 7).
INCLUDE_NAMES = {
    "Мир.md",
    "Персонажи.md",
    "События по главам.md",
    "Хронология.md",
    "Шпаргалка долгов.md",
    "Стиль.md",
    "Сейчас.md",
    "GENERAL.md",
}

INCLUDE_PREFIXES = (
    "Глава ",
    "План главы ",
    "Хвост главы ",
)

SKIP_DIRS = {"архив", ".git", "rag", ".cursor"}


def tokenize(text: str) -> list[str]:
    return re.findall(r"[0-9A-Za-zА-Яа-яЁё]+", text.lower())


def should_index(path: Path) -> bool:
    if any(part in SKIP_DIRS for part in path.parts):
        return False
    name = path.name
    if name in INCLUDE_NAMES:
        return True
    return any(name.startswith(p) for p in INCLUDE_PREFIXES)


def chunk_markdown(text: str, source: str) -> list[dict]:
    parts = re.split(r"(?m)(?=^#{1,3} )", text)
    chunks: list[dict] = []
    for i, part in enumerate(parts):
        part = part.strip()
        if len(part) < 40:
            continue
        if len(part) > 1800:
            paras = [p.strip() for p in re.split(r"\n\s*\n", part) if p.strip()]
            buf = ""
            sub = 0
            for p in paras:
                if len(buf) + len(p) > 1400 and buf:
                    chunks.append(_make_chunk(source, i, sub, buf))
                    sub += 1
                    buf = p
                else:
                    buf = f"{buf}\n\n{p}".strip() if buf else p
            if buf:
                chunks.append(_make_chunk(source, i, sub, buf))
        else:
            chunks.append(_make_chunk(source, i, 0, part))
    return chunks


def _make_chunk(source: str, major: int, minor: int, text: str) -> dict:
    heading = ""
    m = re.match(r"^(#{1,3} .+)$", text, re.M)
    if m:
        heading = m.group(1).lstrip("#").strip()
    toks = tokenize(text)
    return {
        "id": f"{source}::{major}.{minor}",
        "source": source,
        "heading": heading,
        "text": text[:4000],
        "tokens": toks,
    }


def main() -> None:
    chunks: list[dict] = []
    for path in sorted(ROOT.glob("*.md")):
        if not should_index(path):
            continue
        text = path.read_text(encoding="utf-8")
        chunks.extend(chunk_markdown(text, path.name))

    INDEX.write_text(
        json.dumps({"chunks": chunks}, ensure_ascii=False),
        encoding="utf-8",
    )
    print(f"OK: {len(chunks)} chunks -> {INDEX.name}")


if __name__ == "__main__":
    main()

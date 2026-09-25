# -*- coding: utf-8 -*-
"""Спросить индекс: python rag/query.py \"что Лиза знает про кривого\" """
from __future__ import annotations

import json
import re
import sys
from collections import Counter
from pathlib import Path

INDEX = Path(__file__).resolve().parent / "index.json"


def tokenize(text: str) -> list[str]:
    return re.findall(r"[0-9A-Za-zА-Яа-яЁё]+", text.lower())


def score(query_toks: list[str], chunk_toks: list[str]) -> float:
    if not query_toks or not chunk_toks:
        return 0.0
    q = Counter(query_toks)
    c = Counter(chunk_toks)
    overlap = sum(min(q[t], c[t]) for t in q)
    # бонус за редкие совпадения заголовка уже в тексте
    return overlap / (len(query_toks) ** 0.5)


def main() -> None:
    if not INDEX.exists():
        print("Нет индекса. Сначала: python rag/build_index.py")
        sys.exit(1)
    query = " ".join(sys.argv[1:]).strip()
    if not query:
        print('Использование: python rag/query.py "вопрос"')
        sys.exit(1)

    data = json.loads(INDEX.read_text(encoding="utf-8"))
    q_toks = tokenize(query)
    ranked = []
    for ch in data["chunks"]:
        s = score(q_toks, ch["tokens"])
        if s > 0:
            ranked.append((s, ch))
    ranked.sort(key=lambda x: x[0], reverse=True)

    top = ranked[:5]
    if not top:
        print("Ничего не найдено.")
        return

    for i, (s, ch) in enumerate(top, 1):
        head = ch["heading"] or "(без заголовка)"
        snippet = ch["text"].replace("\n", " ")
        if len(snippet) > 500:
            snippet = snippet[:500] + "…"
        print(f"--- {i}. {ch['source']} | {head} | score={s:.2f}")
        print(snippet)
        print()


if __name__ == "__main__":
    main()

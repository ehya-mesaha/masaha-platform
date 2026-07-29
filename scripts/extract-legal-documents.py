r"""Extract the founder-approved legal pack into deployable JSON.

Usage:
    python scripts/extract-legal-documents.py "C:\path\legal-pack.docx"
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from docx import Document


DOCUMENTS = [
    ("platform-terms", "شروط استخدام منصة إحياء مساحة"),
    ("booking-terms", "شروط وأحكام الحجز والخدمات"),
    ("owner-terms", "شروط وأحكام أصحاب المساحات"),
    ("privacy", "سياسة الخصوصية"),
    ("intellectual-property", "سياسة حقوق الملكية الفكرية"),
]


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Pass the source DOCX path as the only argument.")

    source = Path(sys.argv[1])
    project_root = Path(__file__).resolve().parents[1]
    destination = project_root / "src" / "data" / "legal-documents.json"
    paragraphs = [paragraph.text.strip() for paragraph in Document(source).paragraphs]

    starts: list[int] = []
    for _document_id, title in DOCUMENTS:
        matches = [
            index
            for index, paragraph in enumerate(paragraphs)
            if index >= 130 and paragraph == title
        ]
        if not matches:
            raise RuntimeError(f"Could not find legal document title: {title}")
        starts.append(matches[0])

    extracted = []
    for document_index, ((document_id, title), start) in enumerate(
        zip(DOCUMENTS, starts)
    ):
        end = (
            starts[document_index + 1]
            if document_index + 1 < len(starts)
            else len(paragraphs)
        )
        content = [value for value in paragraphs[start + 1 : end] if value]
        if document_index == len(DOCUMENTS) - 1:
            content = [
                value
                for value in content
                if not value.startswith("وصلي اللهم على نبينا")
            ]

        extracted.append(
            {
                "id": document_id,
                "title": title,
                "version": next(
                    (value for value in content if value.startswith("الإصدار")),
                    "الإصدار الأول",
                ),
                "updatedAt": next(
                    (value for value in content if value.startswith("آخر تحديث")),
                    "آخر تحديث: 26-7-2026 — 12-2-1448",
                ),
                "paragraphs": content,
            }
        )

    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(
        json.dumps(extracted, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(extracted)} legal documents to {destination}")


if __name__ == "__main__":
    main()

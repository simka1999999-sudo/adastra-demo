#!/usr/bin/env python3
"""Compress Olga’s lookbook shots into public/ and point catalog images."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

SRC = Path("/tmp/adastra-olga-photos/lookbook")
ROOT = Path(__file__).resolve().parents[1]


def save(src_name: str, dest: Path, max_side=1800, quality=82) -> None:
    src = SRC / src_name
    if not src.exists():
        raise FileNotFoundError(src)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(src)
    if im.mode != "RGB":
        im = im.convert("RGB")
    im.thumbnail((max_side, max_side))
    im.save(dest, "JPEG", quality=quality, optimize=True, progressive=True)
    print(f"{dest.relative_to(ROOT)}  {dest.stat().st_size // 1024}k  {im.size}")


LOOKBOOK = {
    "hero-check.jpg": "!Adastra17057_2.jpg",
    "hero-leo.jpg": "!Adastra17623.jpg",
    "hero-crane.jpg": "!Adastra16437_1.jpg",
    "scene-city.jpg": "!Adastra17147.jpg",
    "scene-trips.jpg": "!Adastra16864.jpg",
    "scene-mountains.jpg": "!Adastra16859-retouched.jpg",
    "scene-kids.jpg": "!Adastra16889.jpg",
}

PRODUCTS = {
    "p-blackhit18": [
        "!Adastra17057_2.jpg",
        "!Adastra17071-retouched_2.jpg",
        "!Adastra17100_1.jpg",
        "!Adastra17106_1.jpg",
        "!Adastra17144-retouched.jpg",
        "!Adastra17147.jpg",
        "!Adastra17165-retouched.jpg",
    ],
    "p-leohit86": [
        "!Adastra17623.jpg",
        "!Adastra17649.jpg",
        "!Adastra17691.jpg",
    ],
    "p-stork18": [
        "!Adastra16426_2.jpg",
        "!Adastra16437_1.jpg",
        "!Adastra16445-retouched.jpg",
        "!Adastra16450-retouched.jpg",
        "!Adastra16453-retouched.jpg",
        "!Adastra16515-retouched.jpg",
        "!Adastra16522-retouched.jpg",
        "!Adastra16527-retouched.jpg",
    ],
}


def main() -> None:
    for dest_name, src_name in LOOKBOOK.items():
        save(src_name, ROOT / "public/lookbook" / dest_name, max_side=2000, quality=84)

    web_paths: dict[str, list[str]] = {}
    for product_id, names in PRODUCTS.items():
        paths = []
        for i, src_name in enumerate(names):
            dest = ROOT / "public/products" / product_id / f"studio-{i:02d}.jpg"
            save(src_name, dest, max_side=1600, quality=82)
            paths.append(f"/products/{product_id}/{dest.name}")
        web_paths[product_id] = paths

    catalog_path = ROOT / "content/products/catalog.json"
    catalog = json.loads(catalog_path.read_text())
    for product in catalog:
        pid = product.get("id")
        if pid not in web_paths:
            continue
        old = [p for p in product.get("images", []) if "/ozon-" in p][:4]
        product["images"] = web_paths[pid] + old
        if pid == "p-stork18":
            product["isHit"] = True
            product["featured"] = True
            product["hitRank"] = 6
        print("catalog", pid, "images", len(product["images"]))
    catalog_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()

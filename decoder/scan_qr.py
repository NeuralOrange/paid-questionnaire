#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
二维码扫描器：从图片中自动识别并解码问卷数据二维码。
支持图片中包含其他界面元素（如截图），会自动定位二维码区域。

用法：
    python scan_qr.py                  # 扫描 Input/ 文件夹，输出到 Output/
    python scan_qr.py <图片文件或文件夹>
    python scan_qr.py Input/screenshot.png
    python scan_qr.py Screenshots/     # 扫描指定文件夹

输出：
    解码后的结构化 JSON 写入 Output/ 文件夹。

依赖：
    pip install pyzbar pillow opencv-python
"""

import sys
import json
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter
from pyzbar.pyzbar import decode as pyzbar_decode

# 复用解码器
from decode_bin import decode_bytes, DecodeError

# 支持的图片格式
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".webp"}


def scan_qr_from_image(image_path: str) -> list[dict]:
    """
    从图片中检测并解码所有二维码。
    使用 pyzbar 解码，自动处理 RGBA / 灰度等格式。
    支持图片中包含其他界面元素。
    """
    img = Image.open(image_path)
    results = []

    # ---- 策略 1: 原始图片直接解码 ----
    codes = pyzbar_decode(img)
    for code in codes:
        result = _process_qr_data(code.data)
        if result:
            results.append(result)

    # ---- 策略 2: 预处理增强后重试 ----
    if not results:
        for enhanced in _enhance_variants(img):
            codes = pyzbar_decode(enhanced)
            for code in codes:
                result = _process_qr_data(code.data)
                if result:
                    results.append(result)
            if results:
                break

    return results


def _enhance_variants(img):
    """生成多种预处理变体，帮助在复杂图片中识别二维码。"""

    # 转为灰度
    gray = img.convert("L")
    yield gray

    # 提高对比度
    enhancer = ImageEnhance.Contrast(gray)
    yield enhancer.enhance(2.0)

    # 锐化
    yield gray.filter(ImageFilter.SHARPEN)

    # 放大 2x（对小二维码友好）
    w, h = gray.size
    yield gray.resize((w * 2, h * 2), Image.LANCZOS)

    # 二值化（尝试不同阈值）
    for thresh in [128, 100, 160]:
        yield gray.point(lambda x: 0 if x < thresh else 255, "1")


def _process_qr_data(data: bytes) -> dict | None:
    """
    处理从二维码解码出的数据。
    支持 GK1.+base64 编码（GK1. 前缀 + Base64 二进制）。
    """
    if not data:
        return None

    # 尝试 UTF-8 解码
    try:
        text = data.decode("utf-8").strip()
    except UnicodeDecodeError:
        text = data.decode("latin-1").strip()

    if not text:
        return None

    # 仅处理 GK1. 前缀的问卷数据二维码，忽略无关二维码
    if not text.startswith("GK1."):
        return None

    raw_bytes = text.encode("ascii", errors="replace")
    return decode_bytes(raw_bytes)


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else "Input"
    output_dir = Path(__file__).resolve().parent.parent / "Output"
    output_dir.mkdir(exist_ok=True)

    # 收集待处理的文件
    image_files = []
    target_path = Path(target)
    if target_path.is_dir():
        for f in sorted(target_path.iterdir()):
            if f.suffix.lower() in IMAGE_EXTS:
                image_files.append(f)
    elif target_path.is_file():
        if target_path.suffix.lower() in IMAGE_EXTS:
            image_files.append(target_path)
        else:
            print(f"错误：不支持的文件格式 '{target_path.suffix}'", file=sys.stderr)
            sys.exit(1)
    else:
        print(f"错误：找不到 '{target}'", file=sys.stderr)
        sys.exit(1)

    if not image_files:
        print("未找到图片文件。")
        sys.exit(0)

    print(f"找到 {len(image_files)} 个图片文件")
    processed = 0

    for img_file in image_files:
        print(f"\n处理: {img_file.name}")
        try:
            results = scan_qr_from_image(str(img_file))
            if not results:
                print(f"  [WARN] 未检测到有效问卷二维码")
                continue

            for i, result in enumerate(results):
                stem = img_file.stem
                if len(results) > 1:
                    stem += f"_qr{i + 1}"
                out_name = f"{stem}.json"
                out_path = output_dir / out_name

                with open(out_path, "w", encoding="utf-8") as f:
                    json.dump(result, f, ensure_ascii=False, indent="  ")
                print(f"  -> 已输出: Output/{out_name}")
                processed += 1

        except Exception as e:
            print(f"  [FAIL] 处理失败: {e}")

    print(f"\n完成：{processed} 个文件已输出至 Output/")


if __name__ == "__main__":
    main()

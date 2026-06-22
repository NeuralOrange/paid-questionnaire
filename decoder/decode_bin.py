#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
解码器：将问卷二进制结果文件 (.bin) 还原为结构化 JSON。

用法：
    python decode_bin.py <输入文件.bin> [输出文件.json]

示例：
    python decode_bin.py 高考志愿问卷结果_2026-06-23.bin
    python decode_bin.py result.bin output.json
"""

import sys
import json
from datetime import datetime, timezone


# ============================================================
# 选项标签查找表（与前端 app.js 保持严格一致）
# ============================================================

# 家长第1题：发展路径偏好
Q01_LABELS = {
    0: "A. 孩子毕业去一线城市，起薪七八千，但经常加班出差，中年可能有裁员风险。",
    1: "B. 孩子回本省县城，起薪三四千，但安稳有编制，能踏实干到退休。",
}

# 家长第2题：风险承受能力
Q02_LABELS = {
    0: "A. 为了更高的上限，可以接受毕业后前几年不稳定，甚至可能需要家里短期接济。",
    1: "B. 必须保证毕业后立刻有稳定的工作和收入，不接受“飘着”的状态。",
}

# 家长第3题：面子与实惠
Q03_LABELS = {
    0: "A. 学校名声大、说出来有面子更重要，专业差点可以接受。",
    1: "B. 专业好就业、将来出路实在更重要，学校名气可以妥协。",
}

# 家长第4题：学历支撑上限
Q04_LABELS = {
    0: "A. 本科毕业必须工作，不能再供了。",
    1: "B. 可以支持读一个国内研究生（2-3年）。",
    2: "C. 全力支持，读到博士也没问题。",
}

# 家长第5题：考公/脱产备考容忍度
Q05_LABELS = {
    0: "A. 不能接受，毕业必须立刻就业。",
    1: "B. 可以接受1年以内。",
    2: "C. 全力支持，考上为止。",
}

# 家长第6题 & 学生第12题：专业方向
Q06_OPTIONS = [
    "临床医学/口腔医学",
    "计算机/软件工程",
    "法学",
    "会计学/财务管理",
    "汉语言文学/新闻传播",
    "师范类",
    "电气工程",
    "石油工程",
    "金融学/经济学",
    "建筑学/土木工程",
    "英语/日语/其他小语种",
    "历史学/世界史/考古学",
    "行政管理/公共事业管理",
    "数学/物理",
    "统计学/大数据",
    "思想政治教育/马克思主义理论",
    "机械工程/自动化",
]

# 家长第7题 & 学生第13题：最看重特质
Q07_LABELS = {
    0: "A. 将来好考公务员/事业单位",
    1: "B. 本科毕业就能找到高薪工作",
    2: "C. 将来好读研深造，有学术前途",
    3: "D. 家里有相关行业资源，能帮上忙",
}

# 学生第1题：性别
GENDER_LABELS = {
    0: "男",
    1: "女",
}

# 学生第2题：分数层次定位
SCORE_TIER_LABELS = {
    0: "A. 985/顶尖211边缘（全省位次约前3%）",
    1: "B. 中坚211/优质一本（全省位次约前10%）",
    2: "C. 一本线附近（全省位次约前20%）",
    3: "D. 二本中上（公办本科稳，但好专业需精挑）",
    4: "E. 二本线附近或以下（民办本科/优质专科需权衡）",
}

# 学生第3题：发展路径偏好
QS1_LABELS = {
    0: "A. 我毕业想去一线城市，起薪七八千，但经常加班出差，中年可能有裁员风险。",
    1: "B. 我毕业想回本省县城，起薪三四千，但安稳有编制，能踏实干到退休。",
}

# 学生第4题：风险承受能力
QS2_LABELS = {
    0: "A. 为了更高的上限，我可以接受毕业后前几年不稳定，甚至可能需要家里短期接济。",
    1: 'B. 我必须保证毕业后立刻有稳定的工作和收入，不接受“飘着”的状态。',
}

# 学生第5题：面子与实惠
QS3_LABELS = {
    0: "A. 学校名声大、说出来有面子更重要，专业差点我可以接受。",
    1: "B. 专业好就业、将来出路实在更重要，学校名气我可以妥协。",
}

# 学生第6/7题：学科列表
SUBJECT_OPTIONS = [
    "语文", "数学", "英语", "物理", "化学", "生物",
    "历史", "地理", "政治", "信息技术", "通用技术",
]

# 学生第8题：学科能力自评标签
EVAL_LABELS = {
    2: "轻松驾驭",
    1: "正常应付",
    0: "非常吃力",
}
EVAL_KEYS = ["q8_math", "q8_physics", "q8_chemistry", "q8_english"]

# 学生第9题：感官耐受度
Q09_OPTIONS = [
    "见血、见伤口、见手术场面",
    "解剖动物（包括青蛙、小白鼠）",
    "长时间对着显微镜或用精密工具（手抖不行）",
    "每天在户外风吹日晒",
    "一天到晚对着电脑屏幕敲代码",
]

# 学生第10题：活动角色
Q10_LABELS = {
    0: "A. 在后台负责统计表格、准备物料（倾向数据处理、独处）",
    1: "B. 在前台担任主持人或负责接待来宾（倾向人际交互、表达）",
    2: "C. 作为普通观众在下面看（倾向回避高压社交）",
}

# 学生第11题：细节耐受度
Q11_LABELS = {
    0: "A. 是，我经常能看出别人的错别字或数据错误。",
    1: "B. 不是，我大大咧咧，抓大放小。",
}

# 霍兰德类型名称
HOLLAND_TYPES = ["R", "I", "A", "S", "E", "C"]

# 36题的类型映射（与 app.js HOLLAND_QUESTIONS 一致）
HOLLAND_QUESTION_TYPES = [
    "C", "R", "I", "A", "S", "E",
    "R", "S", "C", "E", "I", "A",
    "I", "R", "E", "C", "A", "S",
    "E", "I", "S", "A", "C", "R",
    "S", "C", "R", "E", "A", "I",
    "A", "R", "C", "S", "E", "I",
]


# ============================================================
# 解码器
# ============================================================

class DecodeError(Exception):
    pass


def read_radio(data: bytes, offset: int, labels: dict) -> tuple:
    """读取一个单选题值，返回 (重建的dict, 新offset)。0xFF 表示 null。"""
    val = data[offset]
    offset += 1
    if val == 0xFF:
        return None, offset
    if val not in labels:
        raise DecodeError(f"偏移 {offset-1}: 无效的选项索引 {val}")
    ch = chr(65 + val)  # 0→'A', 1→'B', ...
    return {"value": ch, "label": labels[val]}, offset


def read_text(data: bytes, offset: int) -> tuple:
    """读取一个文本字段（1字节长度前缀 + UTF-8）。"""
    length = data[offset]
    offset += 1
    if length == 0:
        return None, offset
    raw = data[offset:offset + length]
    offset += length
    try:
        return raw.decode("utf-8"), offset
    except UnicodeDecodeError:
        raise DecodeError(f"偏移 {offset - length}: UTF-8 解码失败")


def read_choice_list(data: bytes, offset: int, lookup: list) -> tuple:
    """读取多选列表（1字节计数 + N个索引字节）。"""
    count = data[offset]
    offset += 1
    if count == 0:
        return None, offset  # 空列表 → null
    items = []
    for _ in range(count):
        idx = data[offset]
        offset += 1
        if idx >= len(lookup):
            raise DecodeError(f"偏移 {offset - 1}: 选项索引 {idx} 超出范围 (0-{len(lookup) - 1})")
        items.append(lookup[idx])
    return items, offset


def decode_bytes(raw: bytes) -> dict:
    """Decode binary data or base64 QR payload (bytes) to structured dict."""

    # Auto-detect: base64 text (from QR code) or binary file
    if raw.startswith(b"GK1."):
        # Base64 payload from QR code scan
        import base64
        b64_str = raw[4:].decode("ascii")
        data = base64.b64decode(b64_str)
    elif raw[:4] == b"GAOK":
        # Native binary format
        data = raw
    else:
        raise DecodeError(
            "无法识别的数据格式。请提供二进制 .bin 文件，或从二维码扫描得到的 base64 文本。"
        )

    if len(data) < 6:
        raise DecodeError("数据太短，不是有效的问卷二进制格式")

    offset = 0

    # ---- HEADER ----
    magic = data[offset:offset + 4]
    if magic != b"GAOK":
        raise DecodeError(f"无效的魔数: {magic!r}，期望 b'GAOK'")
    offset += 4

    version = data[offset]
    offset += 1
    if version != 1:
        raise DecodeError(f"不支持的格式版本: {version}，当前仅支持版本 1")

    flags = data[offset]
    offset += 1
    # flags reserved for future use

    result = {
        "meta": {
            "version": f"{version}.0",
            "date": datetime.now(timezone.utc).isoformat(),
            "title": "2026年高考志愿·家庭决策体检问卷",
        },
        "parent": {},
        "student": {},
        "model36": {
            "name": "多维度专业适配度阻断模型",
            "scores": {},
            "answers": [],
        },
    }

    # ---- PARENT SECTION ----
    p = result["parent"]

    p["q01_发展路径偏好"], offset = read_radio(data, offset, Q01_LABELS)
    p["q02_风险承受能力"], offset = read_radio(data, offset, Q02_LABELS)
    p["q03_面子与实惠"], offset = read_radio(data, offset, Q03_LABELS)
    p["q04_学历支撑上限"], offset = read_radio(data, offset, Q04_LABELS)
    p["q05_考公备考容忍度"], offset = read_radio(data, offset, Q05_LABELS)

    p["q06_专业方向"], offset = read_choice_list(data, offset, Q06_OPTIONS)
    p["q06_其他专业"], offset = read_text(data, offset)

    p["q07_最看重特质"], offset = read_radio(data, offset, Q07_LABELS)
    p["q08_焦虑担心"], offset = read_text(data, offset)

    # ---- STUDENT SECTION ----
    s = result["student"]

    s["q01_性别"], offset = read_radio(data, offset, GENDER_LABELS)
    s["q02_分数层次定位"], offset = read_radio(data, offset, SCORE_TIER_LABELS)
    s["q03_发展路径偏好"], offset = read_radio(data, offset, QS1_LABELS)
    s["q04_风险承受能力"], offset = read_radio(data, offset, QS2_LABELS)
    s["q05_面子与实惠"], offset = read_radio(data, offset, QS3_LABELS)

    s["q06_喜欢学科"], offset = read_choice_list(data, offset, SUBJECT_OPTIONS)
    s["q06_喜欢理由"], offset = read_text(data, offset)

    s["q07_排斥学科"], offset = read_choice_list(data, offset, SUBJECT_OPTIONS)
    s["q07_排斥原因"], offset = read_text(data, offset)

    # 学科能力自评（4科 × 2bit 打包在1字节中）
    eval_byte = data[offset]
    offset += 1
    eval_obj = {}
    for i, key in enumerate(EVAL_KEYS):
        shift = 6 - 2 * i
        val = (eval_byte >> shift) & 0x03
        eval_obj[key] = val
    s["q08_学科能力自评"] = eval_obj

    s["q09_感官耐受度"], offset = read_choice_list(data, offset, Q09_OPTIONS)

    s["q10_活动角色"], offset = read_radio(data, offset, Q10_LABELS)
    s["q11_细节耐受度"], offset = read_radio(data, offset, Q11_LABELS)

    s["q12_专业方向"], offset = read_choice_list(data, offset, Q06_OPTIONS)
    s["q12_其他专业"], offset = read_text(data, offset)

    s["q13_最看重特质"], offset = read_radio(data, offset, Q07_LABELS)
    s["q14_焦虑担心"], offset = read_text(data, offset)

    # ---- MODEL36 SECTION ----
    m = result["model36"]
    scores = {}
    for i, t in enumerate(HOLLAND_TYPES):
        if offset >= len(data):
            raise DecodeError("MODEL36 分数段不完整")
        scores[t] = data[offset]
        offset += 1
    m["scores"] = scores

    # 36题答案解包 (每2bit一个答案)
    answers = []
    for ai in range(36):
        byte_idx = ai // 4
        bit_off = 6 - 2 * (ai % 4)
        if offset + byte_idx >= len(data):
            raise DecodeError(f"MODEL36 答案段不完整：缺少第 {ai + 1} 题")
        score = (data[offset + byte_idx] >> bit_off) & 0x03
        answers.append({
            "id": ai + 1,
            "type": HOLLAND_QUESTION_TYPES[ai],
            "score": score,
        })
    offset += 9
    m["answers"] = answers

    return result


# ============================================================
# CLI
# ============================================================

def decode_binary(filepath: str) -> dict:
    """从文件路径读取并解码。"""
    with open(filepath, "rb") as f:
        raw = f.read()
    return decode_bytes(raw)


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else None

    try:
        result = decode_binary(input_path)
    except FileNotFoundError:
        print(f"错误：找不到文件 '{input_path}'", file=sys.stderr)
        sys.exit(1)
    except DecodeError as e:
        print(f"解码错误：{e}", file=sys.stderr)
        sys.exit(1)

    json_str = json.dumps(result, ensure_ascii=False, indent="  ")

    if output_path:
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(json_str)
        print(f"已输出至：{output_path}")
    else:
        print(json_str)


if __name__ == "__main__":
    main()

"""Generate a crisp, offline QR PNG for the deployed order-form URL."""

import argparse
import binascii
import struct
import zlib
from pathlib import Path


# QR Model 2, error-correction level L. Versions 1–5 use one RS block each.
BLOCKS = {
    1: (26, 19, 7),
    2: (44, 34, 10),
    3: (70, 55, 15),
    4: (100, 80, 20),
    5: (134, 108, 26),
}


def gf_multiply(left, right):
    product = 0
    while right:
        if right & 1:
            product ^= left
        right >>= 1
        left <<= 1
        if left & 0x100:
            left ^= 0x11D
    return product


def error_correction(data, count):
    generator = [1]
    root = 1
    for _ in range(count):
        next_generator = [0] * (len(generator) + 1)
        for index, coefficient in enumerate(generator):
            next_generator[index] ^= coefficient
            next_generator[index + 1] ^= gf_multiply(coefficient, root)
        generator = next_generator
        root = gf_multiply(root, 2)

    remainder = [0] * count
    for value in data:
        factor = value ^ remainder[0]
        remainder = remainder[1:] + [0]
        for index in range(count):
            remainder[index] ^= gf_multiply(generator[index + 1], factor)
    return remainder


def append_bits(target, value, count):
    for shift in range(count - 1, -1, -1):
        target.append((value >> shift) & 1)


def encode_data(payload):
    raw = payload.encode("utf-8")
    version = next(
        (candidate for candidate, (_, data_bytes, _) in BLOCKS.items()
         if 4 + 8 + 8 * len(raw) <= data_bytes * 8),
        None,
    )
    if version is None:
        raise ValueError("The link is too long for this QR generator (maximum 106 UTF-8 bytes).")

    _, data_count, ecc_count = BLOCKS[version]
    bits = []
    append_bits(bits, 0b0100, 4)  # Byte mode.
    append_bits(bits, len(raw), 8)
    for value in raw:
        append_bits(bits, value, 8)
    bits.extend([0] * min(4, data_count * 8 - len(bits)))
    bits.extend([0] * ((-len(bits)) % 8))

    data = []
    for offset in range(0, len(bits), 8):
        value = 0
        for bit in bits[offset:offset + 8]:
            value = (value << 1) | bit
        data.append(value)
    pad = 0xEC
    while len(data) < data_count:
        data.append(pad)
        pad ^= 0xEC ^ 0x11

    return version, data + error_correction(data, ecc_count)


def make_matrix(version, codewords):
    size = 17 + version * 4
    matrix = [[None] * size for _ in range(size)]

    def function(x, y, dark):
        if 0 <= x < size and 0 <= y < size:
            matrix[y][x] = bool(dark)

    def finder(center_x, center_y):
        for dy in range(-1, 8):
            for dx in range(-1, 8):
                x, y = center_x + dx, center_y + dy
                inside = 0 <= dx <= 6 and 0 <= dy <= 6
                dark = inside and (
                    dx in (0, 6) or dy in (0, 6) or (2 <= dx <= 4 and 2 <= dy <= 4)
                )
                function(x, y, dark)

    finder(0, 0)
    finder(size - 7, 0)
    finder(0, size - 7)

    for coordinate in range(8, size - 8):
        function(coordinate, 6, coordinate % 2 == 0)
        function(6, coordinate, coordinate % 2 == 0)

    alignment_centers = {1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30]}[version]
    for center_y in alignment_centers:
        for center_x in alignment_centers:
            if matrix[center_y][center_x] is not None:
                continue
            for dy in range(-2, 3):
                for dx in range(-2, 3):
                    function(center_x + dx, center_y + dy, max(abs(dx), abs(dy)) != 1)

    # Reserve both format-information copies and the permanent dark module.
    for index in range(6):
        function(8, index, False)
    function(8, 7, False)
    function(8, 8, False)
    function(7, 8, False)
    for index in range(9, 15):
        function(14 - index, 8, False)
    for index in range(8):
        function(size - 1 - index, 8, False)
    for index in range(8, 15):
        function(8, size - 15 + index, False)
    function(8, size - 8, True)

    data_bits = []
    for byte in codewords:
        append_bits(data_bits, byte, 8)
    bit_index = 0
    right = size - 1
    while right >= 1:
        if right == 6:
            right = 5
        for vertical in range(size):
            upward = ((right + 1) & 2) == 0
            y = size - 1 - vertical if upward else vertical
            for offset in range(2):
                x = right - offset
                if matrix[y][x] is None:
                    dark = data_bits[bit_index] if bit_index < len(data_bits) else 0
                    bit_index += 1
                    # Mask 0 is valid at level L; any one of the eight masks is allowed.
                    if (x + y) % 2 == 0:
                        dark ^= 1
                    matrix[y][x] = bool(dark)
        right -= 2

    # Format information for error-correction level L and mask 0.
    format_data = 0b01 << 3
    remainder = format_data
    for _ in range(10):
        remainder = (remainder << 1) ^ (0x537 if remainder & 0x200 else 0)
    format_bits = ((format_data << 10) | remainder) ^ 0x5412
    for index in range(6):
        function(8, index, (format_bits >> index) & 1)
    function(8, 7, (format_bits >> 6) & 1)
    function(8, 8, (format_bits >> 7) & 1)
    function(7, 8, (format_bits >> 8) & 1)
    for index in range(9, 15):
        function(14 - index, 8, (format_bits >> index) & 1)
    for index in range(8):
        function(size - 1 - index, 8, (format_bits >> index) & 1)
    for index in range(8, 15):
        function(8, size - 15 + index, (format_bits >> index) & 1)
    function(8, size - 8, True)

    return matrix


def png_chunk(kind, data):
    body = kind + data
    return struct.pack(">I", len(data)) + body + struct.pack(">I", binascii.crc32(body) & 0xFFFFFFFF)


def write_png(matrix, output, scale=10):
    quiet = 4
    modules = len(matrix) + quiet * 2
    width = modules * scale
    rows = []
    for y in range(modules):
        module_y = y - quiet
        line = bytearray([0])  # PNG filter: None.
        for x in range(modules):
            module_x = x - quiet
            dark = (
                0 <= module_x < len(matrix)
                and 0 <= module_y < len(matrix)
                and matrix[module_y][module_x]
            )
            line.extend((0 if dark else 255,) * scale)
        row = bytes(line)
        rows.extend([row] * scale)

    image_data = zlib.compress(b"".join(rows), 9)
    header = struct.pack(">IIBBBBB", width, width, 8, 0, 0, 0, 0)
    output.write_bytes(
        b"\x89PNG\r\n\x1a\n"
        + png_chunk(b"IHDR", header)
        + png_chunk(b"IDAT", image_data)
        + png_chunk(b"IEND", b"")
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url", help="Permanent public URL for the standalone order form")
    parser.add_argument("--output", default="desi-dawat-order-form-qr.png", help="PNG output filename")
    args = parser.parse_args()
    version, codewords = encode_data(args.url)
    matrix = make_matrix(version, codewords)
    output = Path(args.output).resolve()
    write_png(matrix, output)
    print(f"Created QR code (version {version}, {len(matrix)}×{len(matrix)} modules): {output}")


if __name__ == "__main__":
    main()

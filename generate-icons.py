"""Generate tree PWA icons using only the standard library (no Pillow required).
Run: python generate-icons.py
Outputs: public/icons/icon-192.png, icon-512.png, apple-touch-icon.png, favicon.ico
"""
import struct
import zlib
import os

def make_png(size: int) -> bytes:
    """Create a minimal PNG with the tree icon design."""
    # Background: midnight void #0f0f1a
    BG  = (15,  15,  26,  255)
    # Gold star glyph
    GOLD = (240, 192, 64,  255)
    # Indigo glow
    GLOW = (99,  102, 241, 80)

    # Build pixel grid
    pixels = [[BG] * size for _ in range(size)]
    cx, cy = size // 2, size // 2

    # Aurora haze (soft radial gradient approximation)
    for y in range(size):
        for x in range(size):
            dist = ((x - cx)**2 + (y - cy)**2) ** 0.5
            if dist < size * 0.4:
                alpha = int(60 * (1 - dist / (size * 0.4)))
                r = min(255, BG[0] + 10)
                g = min(255, BG[1] + 10)
                b = min(255, BG[2] + 30)
                pixels[y][x] = (r, g, b, 255)

    # Draw a six-pointed star (✦) approximation using thick lines + diamond
    s = size
    r1 = int(s * 0.30)   # outer radius
    r2 = int(s * 0.10)   # inner radius

    import math
    def draw_disk(cx2, cy2, radius, color):
        for dy in range(-radius, radius + 1):
            for dx in range(-radius, radius + 1):
                if dx*dx + dy*dy <= radius*radius:
                    px, py = cx2 + dx, cy2 + dy
                    if 0 <= px < s and 0 <= py < s:
                        pixels[py][px] = color

    # Glow halo
    draw_disk(cx, cy, int(r1 * 0.8), GLOW)

    # Star arms — 4 spokes (✦ = 4-pointed)
    arm_w = max(2, int(s * 0.04))
    arm_len = int(s * 0.30)
    for dy in range(-arm_len, arm_len + 1):
        for dx in range(-arm_w, arm_w + 1):
            # Taper: narrower at tips
            taper = max(1, arm_w - abs(dy) * arm_w // arm_len)
            if abs(dx) <= taper:
                if 0 <= cx + dx < s and 0 <= cy + dy < s:
                    pixels[cy + dy][cx + dx] = GOLD
                if 0 <= cx + dy < s and 0 <= cy + dx < s:
                    pixels[cy + dx][cx + dy] = GOLD

    # Bright center
    draw_disk(cx, cy, max(2, int(s * 0.06)), GOLD)

    # Corner accent dots
    offset = int(s * 0.28)
    dot_r  = max(1, int(s * 0.025))
    for ddx, ddy in [(-offset, -offset), (offset, -offset), (-offset, offset), (offset, offset)]:
        draw_disk(cx + ddx, cy + ddy, dot_r, (240, 192, 64, 120))

    # Encode to PNG
    raw_rows = []
    for row in pixels:
        raw_rows.append(b'\x00' + b''.join(bytes(px) for px in row))
    raw_data = b''.join(raw_rows)
    compressed = zlib.compress(raw_data, 9)

    def chunk(tag: bytes, data: bytes) -> bytes:
        length = struct.pack('>I', len(data))
        crc = struct.pack('>I', zlib.crc32(tag + data) & 0xFFFFFFFF)
        return length + tag + data + crc

    ihdr_data = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)
    # Rewrite as RGBA (color type 6)
    ihdr_data = struct.pack('>II', size, size) + bytes([8, 6, 0, 0, 0])

    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', ihdr_data)
    png += chunk(b'IDAT', compressed)
    png += chunk(b'IEND', b'')
    return png


def make_ico(png_32: bytes) -> bytes:
    """Wrap a 32x32 PNG into a minimal .ico file."""
    # ICO header
    header = struct.pack('<HHH', 0, 1, 1)
    # Directory entry for 32x32, 32bpp
    img_size = len(png_32)
    entry = struct.pack('<BBBBHHII', 32, 32, 0, 0, 1, 32, img_size, 22)
    return header + entry + png_32


sizes = [(192, 'icon-192.png'), (512, 'icon-512.png'), (180, 'apple-touch-icon.png')]
os.makedirs('public/icons', exist_ok=True)

for sz, fname in sizes:
    data = make_png(sz)
    path = os.path.join('public', 'icons', fname)
    with open(path, 'wb') as f:
        f.write(data)
    print(f'  OK {path}')

# Also generate a 32x32 favicon
favicon_png = make_png(32)
with open('public/icons/favicon-32.png', 'wb') as f:
    f.write(favicon_png)
ico = make_ico(favicon_png)
with open('public/favicon.ico', 'wb') as f:
    f.write(ico)
print('  OK public/favicon.ico')
print('Done.')

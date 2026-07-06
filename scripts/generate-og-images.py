from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630
OUT = "public/og"
os.makedirs(OUT, exist_ok=True)
FONT_PATH = "/nix/store/xhanp47490n743s7zd27d8i9s1khg6c0-dejavu-fonts-minimal-2.37/share/fonts/truetype/DejaVuSans.ttf"

def f(size):
    return ImageFont.truetype(FONT_PATH, size)

def gradient(c1, c2):
    img = Image.new("RGB", (W, H), c1)
    d = ImageDraw.Draw(img)
    for y in range(H):
        t = y / (H - 1)
        r = int(c1[0] * (1 - t) + c2[0] * t)
        g = int(c1[1] * (1 - t) + c2[1] * t)
        b = int(c1[2] * (1 - t) + c2[2] * t)
        d.line([(0, y), (W, y)], fill=(r, g, b))
    return img

def draw_check(d, cx, cy, r=36):
    d.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(76,175,80))
    d.line([(cx-r*0.4, cy-2), (cx-r*0.05, cy+r*0.32), (cx+r*0.45, cy-r*0.38)], fill="white", width=8)

def make(name, title, subtitle, label=None, accent=(76,175,80)):
    img = gradient((43,45,66), (15,17,32))
    d = ImageDraw.Draw(img)

    # Brand row
    draw_check(d, 90, 90, 36)
    d.text((146, 62), "EligeTuHosting", font=f(40), fill="white")
    d.text((148, 108), "Ranking independiente · Datos verificables", font=f(20), fill=(180,190,210))

    # rule
    d.rectangle([80, 168, W-80, 170], fill=(255,255,255))

    # right country label
    if label:
        tw = d.textlength(label, font=f(48))
        d.rectangle([W-tw-140, 70, W-80, 140], outline=(255,255,255), width=2)
        d.text((W-tw-110, 78), label, font=f(48), fill="white")

    # Title (wrap)
    words = title.split()
    lines, cur = [], ""
    tf = f(80)
    for w in words:
        test = (cur + " " + w).strip()
        if d.textlength(test, font=tf) > W - 160:
            if cur: lines.append(cur)
            cur = w
        else:
            cur = test
    if cur: lines.append(cur)
    y = 240
    for ln in lines[:3]:
        d.text((80, y), ln, font=tf, fill="white")
        y += 92

    # subtitle
    d.text((80, y + 24), subtitle, font=f(30), fill=(210,220,235))

    # accent bar + url
    d.rectangle([80, H-92, 220, H-78], fill=accent)
    d.text((240, H-102), "eligetuhosting.com", font=f(30), fill="white")

    img.save(f"{OUT}/{name}.png", "PNG", optimize=True)
    print("→", name)

make("home", "Mejor Hosting Chile 2026", "Ranking independiente · +5.700 dominios analizados", "CHILE")
make("latam", "Hosting en LATAM", "Chile · Perú · México · Colombia · Argentina", "LATAM")
make("pe", "Hosting en Perú", "Directorio verificable · Metodología abierta", "PERÚ")
make("mx", "Hosting en México", "Directorio verificable · Metodología abierta", "MÉXICO")
make("co", "Hosting en Colombia", "Directorio verificable · Metodología abierta", "COLOMBIA")
make("ar", "Hosting en Argentina", "Directorio verificable · Metodología abierta", "ARGENTINA")
make("datos", "Datos abiertos LATAM", "JSON + Markdown · Licencia CC-BY-4.0", "DATOS")
make("mejor-hosting-cl", "Mejor hosting Chile 2026", "Velocidad, uptime y precio comparados", "CHILE")
make("quienes-somos", "Quiénes somos", "Un equipo pequeño que evalúa hosting en LATAM", "ETH")

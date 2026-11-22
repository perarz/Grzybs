# Builds the Grzybs icon from one set of shapes: writes icon, Android adaptive layers
# (foreground, background, monochrome) and the splash image as SVG into the current folder.
# Turn them into PNG with scripts/render-svg.js (macOS), e.g.
#   osascript -l JavaScript scripts/render-svg.js "$PWD/icon.svg" "$PWD/icon.png" 1024
CAP = "M 252 540 C 252 380 372 262 512 262 C 652 262 772 380 772 540 C 772 566 752 580 726 580 L 298 580 C 272 580 252 566 252 540 Z"
GILLS = "M 300 580 L 724 580 C 700 608 640 618 512 618 C 384 618 324 608 300 580 Z"
STEM = "M 432 600 C 426 680 414 750 400 806 C 396 822 406 834 422 834 L 602 834 C 618 834 628 822 624 806 C 610 750 598 680 592 600 Z"
STEM_SHADE = "M 548 600 L 592 600 C 598 680 610 750 624 806 C 628 822 618 834 602 834 L 566 834 C 576 760 572 680 548 600 Z"
SHINE = "M 326 474 C 336 384 406 320 490 304 C 420 344 374 404 364 482 C 360 504 322 500 326 474 Z"
LEAF_L = "M 402 834 C 330 832 288 800 270 756 C 328 758 374 786 402 834 Z"
LEAF_R = "M 622 834 C 676 828 716 800 732 766 C 686 768 650 794 622 834 Z"

def art(mono=False):
    if mono:
        w = 'fill="#FFFFFF"'
        return f'<path d="{CAP}" {w}/><path d="{STEM}" {w}/><path d="{LEAF_L}" {w}/><path d="{LEAF_R}" {w}/>'
    return (f'<path d="{CAP}" fill="#EFA24F"/>'
            f'<path d="{SHINE}" fill="#F8C68A"/>'
            f'<path d="{GILLS}" fill="#B9692A"/>'
            f'<path d="{STEM}" fill="#EFE8D2"/>'
            f'<path d="{STEM_SHADE}" fill="#D5CAA8"/>'
            f'<path d="{LEAF_L}" fill="#5ED6C4"/>'
            f'<path d="{LEAF_R}" fill="#3FAE9E"/>')

BG = ('<defs><linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1">'
      '<stop offset="0" stop-color="#18221C"/><stop offset="1" stop-color="#060807"/>'
      '</linearGradient></defs><rect width="1024" height="1024" fill="url(#bg)"/>')

def svg(body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">{body}</svg>'

def placed(body, scale):
    # Centre the drawing (its box is x 252–772, y 262–834) and scale it around the middle.
    return f'<g transform="translate(512 512) scale({scale}) translate(-512 -548)">{body}</g>'

files = {
    'icon.svg': svg(BG + placed(art(), 1.0)),
    'foreground.svg': svg(placed(art(), 0.82)),
    'background.svg': svg(BG),
    'monochrome.svg': svg(placed(art(mono=True), 0.82)),
    'splash.svg': svg(placed(art(), 1.0)),
}
for name, content in files.items():
    open(name, 'w').write(content)
print('written', list(files))

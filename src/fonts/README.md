# Fonts

| File | Family | Licence |
| --- | --- | --- |
| `Geist-Latin-wght400-700.woff2` | Geist (variable, weights 400–700) | SIL OFL 1.1 — `Geist-OFL.txt` |
| `GeistMono-Latin-wght400-600.woff2` | Geist Mono (variable, weights 400–600) | SIL OFL 1.1 — `Geist-OFL.txt` |
| `InstrumentSerif-Regular.woff2`, `InstrumentSerif-Italic.woff2` | Instrument Serif | SIL OFL 1.1 — `InstrumentSerif-OFL.txt` |
| `og/InstrumentSerif-Regular.woff` | Instrument Serif (WOFF for Open Graph images) | SIL OFL 1.1 |

The Geist files are subsets of the variable fonts shipped in the `geist` npm package
(v1.7.2): only the weight range the site uses and Latin characters plus common punctuation,
arrows and maths symbols. That roughly halves their size. Characters outside the subset
fall back to the system font. To regenerate them (requires `pip install "fonttools[woff]"`):

```sh
UNI="U+0000-00FF,U+0100-017F,U+0192,U+0218-021B,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2070-209F,U+20AC,U+2122,U+2190-21FF,U+2212,U+2215,U+2248,U+2260,U+2264-2265,U+2318,U+FEFF,U+FFFD"
fonttools varLib.instancer node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2 wght=400:700 -o /tmp/geist.ttf
pyftsubset /tmp/geist.ttf --unicodes="$UNI" --layout-features='*' --flavor=woff2 --output-file=src/fonts/Geist-Latin-wght400-700.woff2
fonttools varLib.instancer node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2 wght=400:600 -o /tmp/geist-mono.ttf
pyftsubset /tmp/geist-mono.ttf --unicodes="$UNI" --layout-features='*' --flavor=woff2 --output-file=src/fonts/GeistMono-Latin-wght400-600.woff2
```

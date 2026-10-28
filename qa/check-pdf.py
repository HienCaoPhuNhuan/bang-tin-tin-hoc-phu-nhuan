"""Check the exported print sheet before publishing it."""
from pathlib import Path
from pypdf import PdfReader
import unicodedata

file = Path(__file__).resolve().parent.parent / 'output/pdf/bang-tin-tin-hoc-60x90cm.pdf'
reader = PdfReader(file)
assert len(reader.pages) == 1, f'Expected one print sheet; got {len(reader.pages)} pages'
page = reader.pages[0]
width, height = float(page.mediabox.width) * 25.4 / 72, float(page.mediabox.height) * 25.4 / 72
assert abs(width - 600) < 0.3 and abs(height - 900) < 0.3, (width, height)
text = unicodedata.normalize('NFC', ' '.join(page.extract_text().split()))
compact_text = ''.join(text.split())
assert '18/2026/TT' in text, 'Missing education framework reference'
assert '02/2025/TT' in text, 'Missing learner framework reference'
assert 'Thiết kế một poster' not in text, 'Old poster assignment is still present'
assert 'Trại lập trình' not in text
assert 'Chương trình bồi dưỡng' in text
assert 'môitrườngđạihọc' in compact_text and 'cáctrườngchuyênkhác' in compact_text
print(f'PDF verified: 1 page, {width:.2f} x {height:.2f} mm')

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
for phrase in ['bản vẽ cơ khí', 'mạch điện tử', 'cựu học sinh', 'ĐHQG TP. HCM', 'Báo chí và Truyền thông', 'Mỹ thuật Công nghiệp', 'VGU, UIT']:
    assert ''.join(phrase.split()) in compact_text, f'Missing updated content: {phrase}'
font_names = set()
type3_count = 0
for reference in page['/Resources']['/Font'].values():
    font = reference.get_object()
    if font.get('/Subtype') == '/Type3':
        # Type 3 stores embedded glyph drawing programs instead of a font file.
        assert '/ToUnicode' in font and font.get('/CharProcs'), 'Missing embedded glyphs or Unicode map'
        assert all(glyph.get_object().get_data() for glyph in font['/CharProcs'].values()), 'Empty embedded glyph'
        type3_count += 1
        continue
    font_name = str(font.get('/BaseFont', 'unknown'))
    font_names.add(font_name)
    descendant = font['/DescendantFonts'][0].get_object() if '/DescendantFonts' in font else font
    descriptor = descendant.get('/FontDescriptor')
    assert descriptor is not None, f'Missing font descriptor: {font_name}'
    descriptor = descriptor.get_object()
    assert any(key in descriptor for key in ['/FontFile', '/FontFile2', '/FontFile3']), f'Font not embedded: {font_name}'
print(f'PDF verified: 1 page, {width:.2f} x {height:.2f} mm')
print(f'Embedded fonts verified: {type3_count} Type 3 subsets and {len(font_names)} other fonts')

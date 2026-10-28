"""Build optimized mobile galleries and clone the approved print content."""
from pathlib import Path
from PIL import Image, ImageOps
import re, json, hashlib, html

ROOT = Path(__file__).resolve().parent.parent
MOBILE = ROOT / 'mobile'
(MOBILE / 'media').mkdir(parents=True, exist_ok=True)
GROUPS = {
    'careers': ('Chạm vào công nghệ', 'Cham vao cong nghe', ['trai-nghiem.jpg']),
    'enrichment': ('Chương trình bồi dưỡng', 'Chuong trinh boi duong', ['ket-noi.jpg']),
    'literacy': ('Đọc tin có kiểm chứng', 'Doc tin co kiem chung', ['tiep-nhan-thong-tin.jpg']),
    'robot': ('Robot dò đường', 'Robot do duong', ['robot.jpg']),
    'design': ('Thiết kế đồ họa', 'Thiet ke do hoa', ['do-hoa.jpg']),
    'ai': ('Sân chơi AI', None, ['ai-challenge.jpg', 'trao-giai-ai.jpg']),
    'team': ('Tổ Tin - Công nghệ', None, ['to-tin-cong-nghe.jpg', 'to-tin-hoc.jpg']),
    'science': ('Khoa học kỹ thuật', None, ['khoa-hoc-ky-thuat.jpg']),
    'teaching': ('Cộng tác trong lớp học số', None, ['google-education.jpg', 'chuyen-de-ai.jpg']),
}
def natural(path):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r'(\d+)', path.name)]
galleries, new_count, duplicates = {}, 0, 0
for key, (title, folder, originals) in GROUPS.items():
    sources = [(ROOT/'assets'/name, False) for name in originals]
    if folder:
        sources += [(p, True) for p in sorted((ROOT.parent/'Hinh anh'/folder).iterdir(), key=natural) if p.suffix.lower() in ['.jpg','.jpeg','.png','.webp']]
    seen, items = set(), []
    for source, is_new in sources:
        digest = hashlib.sha256(source.read_bytes()).hexdigest()
        if digest in seen:
            duplicates += 1
            continue
        seen.add(digest)
        im = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
        im.thumbnail((2000,1600))
        index = len(items)+1
        slug = f'{key}-{index:02d}'
        full = MOBILE/'media'/f'{slug}.webp'
        im.save(full, 'WEBP', quality=87, method=5)
        thumb = im.copy(); thumb.thumbnail((480,360))
        thumb.save(MOBILE/'media'/f'{slug}-thumb.webp','WEBP',quality=80,method=5)
        alt = f'{title} · Ảnh {index:02d}'
        if key == 'team': alt = ['Tập thể Tổ Tin - Công nghệ', 'Tổ Tin học · Hình ảnh lưu giữ'][index-1]
        if key == 'teaching': alt = ['Tập huấn Google Education', 'Chuyên đề trí tuệ nhân tạo'][index-1]
        items.append(dict(src=f'media/{slug}.webp',thumb=f'media/{slug}-thumb.webp',alt=alt,width=im.width,height=im.height,source=source.name))
        new_count += int(is_new)
    galleries[key] = dict(title=title,items=items)
manifest = dict(galleries=galleries,total=sum(len(g['items']) for g in galleries.values()),newPhotos=new_count,duplicatesSkipped=duplicates)
(MOBILE/'galleries.json').write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':')),encoding='utf-8')

source = (ROOT/'index.html').read_text(encoding='utf-8-sig')
cards = {}
for m in re.finditer(r'<article\b[^>]*data-tile="(\d+)".*?</article>',source,re.S):
    number = m.group(1)
    card = m.group(0)
    card = re.sub(r'<figure\b.*?</figure>','',card,flags=re.S)
    card = re.sub(r'<div class="(?:photo-pair|paired-small)">\s*</div>','',card)
    card = re.sub(r'src="assets/', 'src="../assets/', card)
    card = card.replace('data-tile="'+number+'"', f'data-tile="{number}" id="topic-{number}" data-category="'+('activity' if number in ['06','08','09','10','11','12','13','14'] else 'knowledge')+'"')
    card = card.replace('class="tile ', 'class="story reveal ')
    key = {'06':'ai','08':'robot','09':'science','10':'enrichment','11':'literacy','12':'design','13':'teaching','14':'careers'}.get(number)
    if key:
        card = re.sub(r'(</h2>)',r'\1'+f'<div class="gallery" data-gallery="{key}"></div>',card,count=1)
    cards[number] = card
team = re.search(r'<div class="team-intro">.*?</div><img class="legacy-logo"[^>]*></div>',source,re.S)
assert team, 'Could not extract approved team text'
team_text = team.group(0).replace('src="assets/','src="../assets/')
team_card = f'<article class="story team-story reveal" id="topic-02" data-tile="02" data-category="activity"><div class="tile-body">{team_text}<div class="gallery" data-gallery="team"></div></div></article>'
activity_order = ['06','08','09','10','11','12','13','14']
knowledge_order = ['03','04','05','07','15','16']
content = team_card + '<section class="chapter" id="activities"><div class="section-heading reveal"><span class="eyebrow">01 / DẤU ẤN & KẾT NỐI</span><h2>Học bằng trải nghiệm.<br>Lớn lên cùng nhau.</h2><p>Những giờ học mở rộng ra ngoài lớp, những cuộc gặp gỡ nối dài hành trình sáng tạo.</p></div><div class="activity-grid">'+''.join(cards[n] for n in activity_order)+'</div></section>'
content += '<section class="chapter" id="knowledge"><div class="section-heading reveal"><span class="eyebrow">02 / HÀNH TRANG SỐ</span><h2>Hiểu công nghệ.<br>Chủ động tương lai.</h2><p>Kiến thức thiết thực, những ví dụ gần gũi và các tương tác nhỏ để cùng khám phá.</p></div><div class="knowledge-grid">'+''.join(cards[n] for n in knowledge_order)+'</div></section>'
(MOBILE/'content.html').write_text(content,encoding='utf-8')
index_file = MOBILE/'index.html'
if index_file.exists():
    shell = index_file.read_text(encoding='utf-8-sig')
    shell = re.sub(r'<!--APPROVED_CONTENT-->.*?<!--END_APPROVED_CONTENT-->', lambda match: '<!--APPROVED_CONTENT-->'+content+'<!--END_APPROVED_CONTENT-->', shell, flags=re.S)
    index_file.write_text(shell, encoding='utf-8')
print(json.dumps({k:v for k,v in manifest.items() if k!='galleries'}))

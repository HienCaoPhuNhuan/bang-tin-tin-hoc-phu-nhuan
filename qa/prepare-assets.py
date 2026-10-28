from pathlib import Path
from PIL import Image,ImageOps
import urllib.request
root=Path.cwd(); out=root/'bang-tin-tin-hoc/assets'
names={'AI challenge.jpg':'ai-challenge','Chuyen de tri tue nhan tao.jpg':'chuyen-de-ai','Cuoc thi Khoa hoc ki thuat cap thanh pho.jpg':'khoa-hoc-ky-thuat','DSC03404.jpg':'trai-nghiem','Ky nang tiep nhan thong tin.jpg':'tiep-nhan-thong-tin','Robot do duong.jpg':'robot','Tap huan Google Education.jpg':'google-education','Thiet ke do hoa.jpg':'do-hoa','To Tin hoc.jpg':'to-tin-hoc','Trao giai AI.jpg':'trao-giai-ai','UAB2025-Khaimac-236.jpg':'ket-noi'}
for name,slug in names.items():
 im=ImageOps.exif_transpose(Image.open(root/name)).convert('RGB');im.thumbnail((3200,2400)); im.save(out/(slug+'.jpg'),quality=93,optimize=True)
for name,slug in [('Logo To Tin hoc.png','logo-to'),('Logo truong.png','logo-truong'),('Logo.png','logo-50-nam')]:
 im=Image.open(root/'Logo'/name);im.thumbnail((1500,1500));im.save(out/(slug+'.png'),optimize=True)
u='https://raw.githubusercontent.com/google/fonts/main/ofl/notosans/NotoSans%5Bwdth,wght%5D.ttf'
(out/'NotoSans.ttf').write_bytes(urllib.request.urlopen(u).read())
(out/'OFL.txt').write_bytes(urllib.request.urlopen('https://raw.githubusercontent.com/google/fonts/main/ofl/notosans/OFL.txt').read())
print('Prepared',len(names),'photos and 3 logos, local Noto Sans font')


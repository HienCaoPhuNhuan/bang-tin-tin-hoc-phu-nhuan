from PIL import Image,ImageOps,ImageDraw
from pathlib import Path
root=Path.cwd()
files=list(root.glob('*.jpg'))+list((root/'Logo').glob('*.png'))
sheet=Image.new('RGB',(1400,((len(files)+2)//3)*290),'#e8e8e8')
d=ImageDraw.Draw(sheet)
for i,p in enumerate(files):
 im=Image.open(p); im.thumbnail((440,245))
 x=(i%3)*465+10;y=(i//3)*290
 sheet.paste(im,(x,y), im if im.mode=='RGBA' else None)
 d.text((x,y+248),p.name,fill='black')
 d.text((x,y+266),str(Image.open(p).size),fill='black')
sheet.save(root/'bang-tin-tin-hoc/qa/contact.jpg')

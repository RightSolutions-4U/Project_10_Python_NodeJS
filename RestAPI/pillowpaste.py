from PIL import Image, ImageDraw, ImageFilter

im1 = Image.open('MaserT.png')
im2 = Image.open('Tile100_100.png')

# ![rocket](data/src/rocket.jpg)
# ![lena](data/src/lena.jpg)

im1.paste(im2)
im1.save('rocket_pillow_paste.png', quality=95)
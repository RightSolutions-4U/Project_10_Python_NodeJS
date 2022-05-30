import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFilter

if __name__ == '__main__':
    im =  cv2.imread('cropped.jpg')
    imgheight=im.shape[0]
    imgwidth=im.shape[1]
    #print(imgheight)
    #print(imgwidth)
    y1 = 0
    M = 100
    N = 100
    fname = ''
    for y in range(0,imgheight,M):
        for x in range(0, imgwidth, N):
            y1 = y + M
            x1 = x + N
            tiles = im[y:y+M,x:x+N]
            if tiles.shape[0] < 100 or  tiles.shape[1]<100:
                continue
            cv2.rectangle(im, (x, y), (x1, y1), (0, 255, 0))
            if not cv2.imwrite("Tile"+str(x) + '_' + str(y)+".png",tiles):
                raise Exception("Could not write image")
            im2 = Image.open('MasterT.png')
            fname = "Tile"+str(x) + '_' + str(y)+".png"
            #print(fname)
            im3 = Image.open(fname)
            im2.paste(im3)
            im2.save(fname, quality=95)  
            #im3.save('newimage.png')



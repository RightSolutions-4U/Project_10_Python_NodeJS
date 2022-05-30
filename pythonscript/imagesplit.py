import numpy as np
import cv2

def crop_image(image_path, output_path):
    im =  cv2.imread('./images/cropped.jpg')
    imgheight=im.shape[0]
    imgwidth=im.shape[1]
    print(imgheight)
    print(imgwidth)
    y1 = 0
    M = 100
    N = 100
    for y in range(0,imgheight,M):
        for x in range(0, imgwidth, N):
            y1 = y + M
            x1 = x + N
            tiles = im[y:y+M,x:x+N]
            print(tiles.shape[0])
            if tiles.shape[0] < 100 or  tiles.shape[1]<100:
                continue
            cv2.rectangle(im, (x, y), (x1, y1), (0, 255, 0))
            if not cv2.imwrite(output_path+str(x) + '_' + str(y)+".png",tiles):
                raise Exception("Could not write image")
            #if not cv2.imwrite(output_path +  str(x) + '_' + str(y)+"{}.jpg".format(image_path),tiles):
            #    raise Exception("Could not write image")


if __name__ == '__main__':
    img = cv2.imread("./images/wm.jpg")
    mask = np.zeros(img.shape[0:2], dtype=np.uint8)
    points = np.array([[[100,350],[120,400],[310,350],[360,200],[350,20],[25,120]]])
    #method 1 smooth region
    cv2.drawContours(mask, [points], -1, (255, 255, 255), -1, cv2.LINE_AA)
    #method 2 not so smooth region
    # cv2.fillPoly(mask, points, (255))
    res = cv2.bitwise_and(img,img,mask = mask)
    rect = cv2.boundingRect(points) # returns (x,y,w,h) of the rect
    cropped = res[rect[1]: rect[1] + rect[3], rect[0]: rect[0] + rect[2]]
    ## crate the white background of the same size of original image
    wbg = np.ones_like(img, np.uint8)*255
    cv2.bitwise_not(wbg,wbg, mask=mask)
    # overlap the resulted cropped image on the white background
    dst = wbg+res
    cv2.imshow('Original',img)
    #cv2.imshow("Mask",mask)
    #cv2.imshow("Cropped", cropped )
    #cv2.imshow("Samed Size Black Image", res)
    cv2.imshow("Image", dst)
    cv2.waitKey(0)
    cv2.imwrite('./images/cropped.jpg',cropped)
    cv2.destroyAllWindows()
    crop_image('./images/', './cropped/')
import sys
import numpy as np
import cv2

if __name__ == '__main__':
    img = cv2.imread("./images/wm.jpg")
    mask = np.zeros(img.shape[0:2], dtype=np.uint8)
    points = np.array(([[[100,350],[120,400],[310,350],[360,200],[350,20],[25,120]]]))
    cv2.drawContours(mask, [points], -1, (255, 255, 255), -1, cv2.LINE_AA)
    res = cv2.bitwise_and(img,img,mask = mask)
    rect = cv2.boundingRect(points) # returns (x,y,w,h) of the rect
    cropped = res[rect[1]: rect[1] + rect[3], rect[0]: rect[0] + rect[2]]
    wbg = np.ones_like(img, np.uint8)*255
    cv2.bitwise_not(wbg,wbg, mask=mask)
    dst = wbg+res
    cv2.imwrite('cropped.jpg',cropped)
    sys.stdout.flush()
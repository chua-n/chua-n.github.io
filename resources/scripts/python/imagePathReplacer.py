import logging
import os
from tarfile import ENCODING
import win32file

IMAGE_URL = "https://chua-n.gitee.io/figure-bed"
ENCODING = "UTF-8"


def findFilesRecursively(directory):
    filenames = []
    for path in os.listdir(directory):
        path = os.path.join(directory, path)
        if os.path.isfile(path):
            filenames.append(os.path.abspath(path))
        elif os.path.isdir(path) and not (win32file.GetFileAttributes(path) & win32file.FILE_ATTRIBUTE_HIDDEN):
            filenames.extend(findFilesRecursively(path))
    return filenames


def setLogger(name, output_dir="./resources/scripts/python/"):
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)
    c_handler = logging.StreamHandler()
    f_handler = logging.FileHandler(os.path.join(output_dir, name+'.log'), 'w',
                                    encoding=ENCODING)
    c_handler.setLevel(level=logging.INFO)
    f_handler.setLevel(level=logging.DEBUG)
    format = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s')
    c_handler.setFormatter(format)
    f_handler.setFormatter(format)
    logger.addHandler(c_handler)
    logger.addHandler(f_handler)
    return logger


def main(imageDir="./resources/images", rootDir="./"):
    logger = setLogger("image-url")
    logger.critical(IMAGE_URL)
    logger.critical(os.path.abspath(imageDir))
    logger.critical(os.path.abspath(rootDir))
    if (not os.path.isdir(imageDir) or not os.path.isdir(rootDir)):
        raise Exception(
            f"`imageDir={imageDir}`或 `rootDir={rootDir}` 不是有效的文件夹！")
    filenames = [filename for filename in findFilesRecursively(rootDir)
                 if filename.endswith(".md")]
    for filename in filenames:
        relpath = os.path.relpath(imageDir, filename)
        relpath = relpath.replace(os.sep, '/')
        context = None
        with open(filename, mode="r", encoding=ENCODING) as fileObj:
            context = fileObj.read()
        context = context.replace(IMAGE_URL, relpath)
        with open(filename, mode="w", encoding=ENCODING) as fileObj:
            fileObj.write(context)
        logger.info(f"[{filename}] - [{relpath}]")


if __name__ == "__main__":
    main()

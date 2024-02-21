import os


def list_files(dir_path):
    file_list = []
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.md'):
                file_list.append(os.path.join(root, file))
    return file_list


def init_front_matter(folder: str):
    filepaths = list_files(folder)
    for filepath in filepaths:
        with open(filepath, "r", encoding="utf-8") as file:
            lines = file.readlines()
        first_line = lines[0]
        if first_line != "---\n":
            file_name = os.path.splitext(os.path.basename(filepath))[0]
            folder_name = os.path.basename(os.path.dirname(filepath))
            title = folder_name if file_name == 'README' else file_name
            inserting_lines = [
                "---\n",
                f"title: {title}\n",
                "---\n",
                "\n"
            ]
            with open(filepath, "w", encoding="utf-8") as file:
                file.writelines(inserting_lines + lines)


if __name__ == "__main__":
    init_front_matter("E:\\code-chuan\\notebook\\book")

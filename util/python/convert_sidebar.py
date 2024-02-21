def convert_sidebar(filename: str):
    with open("_sidebar.ts", mode="w", encoding="utf-8") as des_file:
        des_file.write("[\n")
        with open(filename, mode="r", encoding="utf-8") as src_file:
            lines = src_file.readlines()
            for line in lines:
                text_start_index = line.find("- [") + 3
                text_end_index = line.find("](")
                if (text_start_index != 2 and text_end_index != -1):
                    text = line[text_start_index:text_end_index]
                    link = line[text_end_index + 2:-2]
                    des_file.write("{\n")
                    des_file.write(f'text: "{text}",\n')
                    des_file.write(f'link: "{link}",\n')
                    des_file.write("},\n")
        des_file.write("]")


if __name__ == "__main__":
    convert_sidebar("D:\\code\\notebook\\app-next\\src\\Java\\_sidebar.md")

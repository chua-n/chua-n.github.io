import os


def replace_blank(raw_str: str):
    return raw_str.replace(" ", "%20")


def build_sidebar(folder: str, link_base: str):
    link_base = replace_blank(link_base)
    filenames = os.listdir(folder)
    filenames.sort()
    with open("_sidebar.md", mode="w", encoding="utf-8") as file:
        for filename in filenames:
            if os.path.isfile(os.path.join(folder, filename)) and filename.endswith(".md"):
                link = replace_blank(filename)
                file.write(f"- [{filename[0:-3]}]({link_base}{link})\n")


if __name__ == "__main__":
    build_sidebar(
        "D:\\code\\notebook\\book\\dsa\\剑指offer",
        "/dsa/剑指offer/"
    )

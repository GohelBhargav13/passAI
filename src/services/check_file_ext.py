# this function is basically check weather the file extension is right

# allowed extenstion
allowed_ext = ["pdf"]

# check the file follow the above extension format
def check_file_ext(filename:str,content_type:str) -> bool:
    if "." not in filename or "/" not in content_type:
        return False
    return filename.split(".")[-1] in allowed_ext and content_type.split("/")[-1] in allowed_ext
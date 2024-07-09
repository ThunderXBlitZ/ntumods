import json
import re
from typing import Dict, List

from bs4 import BeautifulSoup

from interface.course import Course
from interface.module import Module


DATA_DIR = './raw_data/'
OUTPUT_DIR = './output/'


def parse_html(html_content):
    modules = []
    
    soup = BeautifulSoup(html_content, 'html.parser')
    hrs = soup.findAll("hr")
    
    additional_remarks = parse_additional_remarks(hrs[-1])
    
    for hr in hrs:
        metadata_table = hr.find_next('table')
        if metadata_table is None:
            continue
        
        code, title, au, remarks = parse_metadata_table(metadata_table)
        module = Module(code, title, au, remarks)
        
        module_table = metadata_table.find_next('table')
        module = parse_module_table(module, module_table)
        module = add_additional_remarks(module, additional_remarks)
        
        modules.append(module)        

    return modules

def parse_additional_remarks(last_hr) -> Dict:
    additional_remarks = {}
    bolds = last_hr.find_all_next("b")
    for bold in bolds:
        symbol = bold.text[0]
        text = bold.text[2:]
        additional_remarks[symbol] = text
    return additional_remarks

def parse_metadata_table(table):
    rows = table.find_all("tr")
    
    # First Row is Module Code, Module Title, and AU
    first_row = rows[0]
    cols = first_row.find_all("td")
    code, title = cols[0].text, cols[1].text
    au = re.findall("\\d+\\.\\d+", cols[2].text)
    
    # Second Row is comments
    second_row = rows[1]
    cols = second_row.find_all("td")
    remarks = cols[1].text
    return code, title, au, remarks

def parse_module_table(module, table):
    rows = table.find_all("tr")[1:]
    for row in rows:
        course = parse_course(row)
        module.courses.append(course)
    return module

def parse_course(row) -> Course:
    cols = row.find_all("td")
    index, type, group, day, time, venue, remark = cols[0].text, cols[1].text, cols[2].text, cols[3].text, cols[4].text, cols[5].text, cols[6].text
    course = Course(index, type, group, day, time, venue, remark)
    return course

def add_additional_remarks(module: Module, additional_remarks) -> Module:
    for symbol, text in additional_remarks.items():
        if symbol in module.title:
            module.title = module.title.replace(symbol, '')
            module.additional_remarks.append(text)
    return module

def dump_modules(modules:List[Module]):
    modules = { x.code: x.to_dict() for x in modules }
    with open(OUTPUT_DIR + "modules.json", 'w') as f:
        f.write(json.dumps(modules, indent=4, sort_keys=True))


if __name__ == "__main__":
    # TODO
    with open(DATA_DIR + 'data.html', "r") as f:
        html_content = f.read()
        modules = parse_html(html_content)
        dump_modules(modules)
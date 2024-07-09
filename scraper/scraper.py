# https://github.com/ruiofshens/ntu-stars-planner/blob/main/server/scrapper/getCourses.js

import requests
from bs4 import BeautifulSoup


DATA_DIR = './raw_data/'


def getAcadSem():
    """
    Retrieves website's key for current semester

    Returns:
        key: e.g. Acad Yr 2024 Semester 1, 2024;1
    """
    resp = requests.get("https://wish.wis.ntu.edu.sg/webexe/owa/aus_schedule.main")
    soup = BeautifulSoup(resp.text, 'html.parser')
    select = soup.find("select", {"name": "acadsem"})
    option = select.find(selected="selected")
    return option.text, option['value']

def getHtml() -> str:
    semesterTitle, semesterKey = getAcadSem()
    print(semesterTitle, semesterKey)
    params = {
        'acadsem': semesterKey,
        'r_search_type': 'F',
        'boption': 'Search',
        'staff_access': "false",
    }
    resp = requests.get("https://wish.wis.ntu.edu.sg/webexe/owa/AUS_SCHEDULE.main_display1", params=params)
    return resp.text

def save_html(name, html):
    with open(DATA_DIR + '/' + name, 'w') as f:
        f.write(html)
        

if __name__ == "__main__":
    html = getHtml()
    save_html('data.html', html)


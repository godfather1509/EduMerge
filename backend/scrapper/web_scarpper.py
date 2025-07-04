from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def scrapper():
    options=Options()
    options.add_argument('--headless')
    options.add_argument('disable-gpu')
    options.add_argument('--window-size=1920,1080')

    driver = webdriver.Chrome(options=options)
    driver.get('https://ocw.mit.edu/search/?type=course')

    try:
        SCROLL_PAUSE_TIME = 2
        last_height = driver.execute_script("return document.body.scrollHeight")

        # Scroll down repeatedly until no new content is loaded
        i=0
        while i<10:
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(SCROLL_PAUSE_TIME)

            new_height = driver.execute_script("return document.body.scrollHeight")
            i+=1
            if new_height == last_height:
                break  # No new content loaded
            last_height = new_height

        # After scrolling is complete, get all course cards
        cards = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, "card"))
        )

        print(f"Total courses found: {len(cards)}\n")

        courses=[]

        for index, card in enumerate(cards, start=1):
            try:
                title_element = card.find_element(By.TAG_NAME, "a")
                title = title_element.text.strip()
                link = title_element.get_attribute("href")
                topic_element=card.find_element(By.CLASS_NAME,"topics-list")
                topic_content=topic_element.find_elements(By.CLASS_NAME,"topic-link")
                topics=""
                for topic in topic_content:
                    topics=topics+", "+topic.text.strip()

                try:
                    instructor_element = card.find_element(By.CLASS_NAME, "content")
                    instructor = instructor_element.text.strip()
                except:
                    instructor = "MIT"
                courses.append([index,title,link,instructor,topics])
                if __name__=="main":
                    print(f"Course {index}:")
                    print(f"Title     : {title}")
                    print(f"Link      : {link}")
                    print(f"Instructor: {instructor}")
                    print(f"Topics:{topics}")
                    print("-" * 50)
            except Exception as e:
                print(f"Error processing course {index}: {e}")

    finally:
        driver.quit()
    
    return(courses)

if __name__=="main":
    scrapper()

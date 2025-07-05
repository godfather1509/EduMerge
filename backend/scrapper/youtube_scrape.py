from googleapiclient.discovery import build
import os, dotenv
from isodate import parse_duration

dotenv.load_dotenv()


def parse_youtube(query):
    # Replace with your API key
    YOU_TUBE_API_KEY = os.getenv("YOU_TUBE_API_KEY")

    # Build YouTube API client
    youtube = build("youtube", "v3", developerKey=YOU_TUBE_API_KEY)

    # Search query
    # query = "python programming course"

    # Call the search.list method
    request = youtube.search().list(
        part="snippet", q=query, type="video", maxResults=30
    )
    # passing part gives us different kind of data about video

    response = request.execute()

    # Print results
    data = []
    for item in response["items"]:
        # print(item)
        title = item["snippet"]["title"]
        video_id = item["id"]["videoId"]
        details = (
            youtube.videos().list(part="contentDetails,snippet", id=video_id).execute()
        )
        time = parse_duration(
            details["items"][0]["contentDetails"]["duration"]
        ).total_seconds()
        # if duration of video is less than 60 seconds than it is youtube shorts
        item_details = details["items"][0]
        category_id = item_details["snippet"].get("categoryId", None)
        instructor = item["snippet"]["channelTitle"]
        url = f"https://www.youtube.com/watch?v={video_id}"
        not_allowed=["24","10","23"] 
        # these categories are for entertainment, music video and comedy videos
        if time > 60 and category_id not in not_allowed:
            # if video length is less than 60 seconds than it is short video
            data.append(
                {
                    "title": title,
                    "link": url,
                    "instructor": instructor,
                    "duration": time,
                    "video_category":category_id
                }
            )
            if __name__ == "__main__":
                print(f"{title}\n{url}\n{instructor}\n{time}\n")
    return data


if __name__ == "__main__":
    parse_youtube("Python")

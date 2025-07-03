from googleapiclient.discovery import build

# Replace with your API key
YOU_TUBE_API_KEY='AIzaSyAnq9Smxa_lAqY_Z_YcJvjYoE8Eye4BYZc'

# Build YouTube API client
youtube = build('youtube', 'v3', developerKey=YOU_TUBE_API_KEY)

# Search query
query = "python programming course"

# Call the search.list method
request = youtube.search().list(
    part="snippet",
    q=query,
    type="video",
    maxResults=10
)

response = request.execute()

# Print results
for item in response['items']:
    title = item['snippet']['title']
    video_id = item['id']['videoId']
    url = f"https://www.youtube.com/watch?v={video_id}"
    print(f"{title}\n{url}\n")

from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
import pymongo, dotenv, os
from pymongo.server_api import ServerApi
from pymongo.mongo_client import MongoClient
from .youtube_scrape import parse_youtube
from .web_scraper import scraper
from .web_scrapper_search import search_scraper

dotenv.load_dotenv()


def convert_id(data):
    # converts Object_id into string
    for item in data:
        if "_id" in item:
            item["_id"] = str(item["_id"])
    return data


class WebScraper(APIView):
    def get(self, request):
        uri = os.getenv("MONGO_DB_URL")
        # Create a new client and connect to the server
        client = MongoClient(uri, server_api=ServerApi("1"))
        mydb = client[
            "ScrapperDB"
        ]  # this will create database if it does not already exists
        mytable = mydb["scraped_data"]

        if mytable.count_documents({}) == 0:
            data = scraper()
            print("The collection is empty. Inserting data...")
            index = mytable.insert_many(data)
            return Response(
                convert_id(data), status=status.HTTP_201_CREATED
            )  # Use 201 for created
        else:
            data = list(mytable.find())
            # this will give all the data present in database
            print("Data already exists in the collection.")
            return Response(convert_id(data), status=status.HTTP_200_OK)


class SearchScraper(APIView):
    def get(self, request, query):
        data=[]
        data.append(search_scraper(query))
        data.append(parse_youtube(query))
        return Response(data, status=status.HTTP_302_FOUND)

from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .web_scraper import scraper
from .web_scrapper_search import search_scraper
import pymongo,dotenv,os
from pymongo.server_api import ServerApi
from pymongo.mongo_client import MongoClient

dotenv.load_dotenv()

class WebScrapper(APIView):
    def get(self,request):
        uri = f"mongodb+srv://{os.getenv('MONGO_DB_USER')}:{os.getenv('MONGO_DB_PASSWORD')}@cluster0.yni4bb0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

        # Create a new client and connect to the server
        client = MongoClient(uri, server_api=ServerApi('1'))
        try:
            client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(e)
        dblist = client.list_database_names()
        if "ScrapperDB" not in dblist:
            print(scraper())
            print("The database not exists.")
            mydb = client["ScrapperDB"]
                    
        return Response(status=status.HTTP_404_NOT_FOUND)

class SearchScrapper(APIView):
    def get(self,request,query):
        print(search_scraper(query))
        return Response(status=status.HTTP_404_NOT_FOUND)
import requests
import os
from dotenv import load_dotenv
load_dotenv()

genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Abenteuer"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Komödie"
    },
    {
      "id": 80,
      "name": "Krimi"
    },
    {
      "id": 99,
      "name": "Dokumentarfilm"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Familie"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "Historie"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Musik"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Liebesfilm"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV-Film"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "Kriegsfilm"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]

def load_movies():
    
    url = "https://api.themoviedb.org/3/movie/popular?language=en-US" 
    
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {os.getenv('TMDB_TOKEN')}"
    }
    
    response = requests.get(url, headers=headers)
    
    try:
        movies = response.json().get("results", [])
        return movies
    
    except:
        print(f"❌ Error: {response.json()}")
        return []


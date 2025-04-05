import os
from dotenv import load_dotenv
import pymongo
load_dotenv()
def db_connection():
    try:
        mongo_uri=os.getenv("MONGO_URI")
        client=pymongo.MongoClient(mongo_uri)
        db=client.get_database()
        print("Database connected successfully")
        return db
    except Exception as e:
        print("Error connecting to MongoDB:", e)
        return None
from flask import Flask,jsonify
from routes.userRoutes import resume_analysis
from flask_cors import CORS
app = Flask(__name__)
from dotenv import load_dotenv
load_dotenv()
import os
CORS(app,origins=[os.getenv("NODE_LOCALHOST_URL"),os.getenv("NODE_BACKEND_URL"),os.getenv("FRONTEND_URL"),os.getenv("LOCALHOST_URL")])
app.register_blueprint(resume_analysis)
@app.route('/')
def test():
    return jsonify({"message":"WORKING"}),200

if __name__ == "__main__":
    app.run(debug=False)

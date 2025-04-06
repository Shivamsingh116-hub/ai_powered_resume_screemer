from flask import Blueprint, jsonify, request
from database.dbConnection import db_connection
from controller.resumeAnalysis import handle_resume_analysis
from bson import ObjectId

resume_analysis = Blueprint("resume_analysis", __name__)

@resume_analysis.route('/wakeup', methods=['GET'])
def wakeup():
    return jsonify({"message": "Backend is alive!"}), 200

@resume_analysis.route("/resume_analysis", methods=["GET"])
def get_description_data():
    try:
        userId = request.args.get("userId")
        job = request.args.get("job")
        resume = request.args.get("resume")

        if not all([userId, job, resume]):
            return jsonify({"error": "Missing required query parameters"}), 400

        db = db_connection()
        resultData = db["resultData"]
        result_data = handle_resume_analysis(job, resume, userId)
        if not result_data:
            return jsonify({"message": "No data found"}), 400
        
        if result_data.get("message"):
            return jsonify({'message':result_data.get("message")}),422
        if result_data.get("error"):
            return jsonify({'error':result_data.get("error")}),500
        
        findUserResult=resultData.find({"user_id":result_data.get("user_id")})
        for result in findUserResult:
            if result.get("job_id") == result_data.get("job_id") and result.get("resume") == result_data.get("resume"):
                result["_id"]=str(result["_id"])
                print(result.get("_id"))
                print("false")
                return jsonify({
                    "message":"Resume already analyzed",
                    "data":result
                }),200
        save_result = resultData.insert_one(result_data)
        result_data["_id"]=str(save_result.inserted_id)
        return jsonify({
            "message": "Resume analyzed and data saved successfully!",
            "inserted_id": str(save_result.inserted_id),
            "data":result_data
            }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

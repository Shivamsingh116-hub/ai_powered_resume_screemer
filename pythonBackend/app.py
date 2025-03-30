from flask import Flask, request, jsonify
from technicalSkills import technical_skills
from flask_cors import CORS
import pdfplumber
import spacy
import re
app = Flask(__name__)
CORS(app)
nlp = spacy.load("en_core_web_sm")

def extract_text_from_pdf(file):
    text_data=[]
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text_data.append(page.extract_text())
    return "\n".join(text_data)

def clean_set(set):
    """Convert to lowercase and remove special characters like '.' and '-'"""
    return re.sub(r'[^a-zA-Z0-9 ]', '', set.lower())


def analyze_resume(text_data):
    doc = nlp(text_data)
    experience = []
    education = []
    skills = []
    organizations = []
    otherData = []

    for ent in doc.ents:
        if ent.label_ == "DATE" and ("year" in ent.text.lower() or ent.text.isdigit()):
            experience.append(ent.text)
        elif ent.label_ == "ORG":
            organizations.append(ent.text)
        elif ent.label_ == "PERSON":
            otherData.append(ent.text)
    
    # Extract skills from text
    words = set(text_data.split())  # Tokenize text into words
    resume_clean_text={clean_set(text) for text in words}
    job_description_skills_lower = {clean_set(skill) for skill in technical_skills}
    skills = list(resume_clean_text.intersection(job_description_skills_lower))  # Match with known skills
    
    return {
        "experience": experience,
        "education": organizations,  # Organizations can sometimes be universities
        "skills": skills,
        "otherData": otherData
    }
@app.route("/uploadResume", methods=["POST"])
def upload_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files["resume"]

    if file and file.filename.endswith(".pdf"):
        text_data = extract_text_from_pdf(file)
        resume_data = analyze_resume(text_data)
        print(resume_data)
        return jsonify({"message": "Resume processed successfully", "resume_data": resume_data})

    return jsonify({"error": "Invalid file format"}), 400

if __name__ == "__main__":
    app.run(debug=True)

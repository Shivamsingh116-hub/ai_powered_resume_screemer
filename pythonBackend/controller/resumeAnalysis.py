import os
import requests
import io
import json
import re
import spacy
import pdfplumber
from dotenv import load_dotenv
from datetime import datetime
from database.storeData import SKILLS,EDUCATION
load_dotenv()
NODE_LOCALHOST_URL = os.getenv("NODE_LOCALHOST_URL", "http://localhost:5000")
NODE_BACKEND_URL = os.getenv("NODE_BACKEND_URL", "https://ai-powered-resume-screemer.onrender.com")
nlp = spacy.load("en_core_web_sm")
# Main function
def handle_resume_analysis(job, resume,userId):
    jobData = json.loads(job)
    pdfUrl = f"{NODE_BACKEND_URL}/{resume}"
    text = extract_text_from_pdf(pdfUrl)
    if not text:
        return {"error": "Failed to extract text from resume."}
    
    check_isresume=is_resume(text)
    if not check_isresume:
        return {'message':"The uploaded file is not a valid resume."}
    doc = nlp(text)
    resume_skills = extract_main_text(doc)
    required_skills = extract_required_skills(jobData['skills'])

    experience_years = extract_experience_years(text)
    education = extract_education(text)
    project_keywords = extract_projects(text)
    skill_score, matched_skills = calculate_skill_match_score(resume_skills, required_skills)
    experience_score = score_experience(experience_years, jobData.get("experience", 0))
    education_score = score_education(education, jobData.get("education", ""))
    project_score = score_projects(project_keywords, jobData.get("project_keywords", ""))
    
    total_score = calculate_total_score(skill_score, experience_score, education_score, project_score)
    submission_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return {
        "job_id":jobData.get("_id"),
        "job_title":jobData.get("title"),
        "job_description":jobData.get("description"),
        "resume":resume,
        "user_id":userId,
        "matched_skills": matched_skills,
        "required_skills": required_skills,
        "match_score": skill_score,
        "experience_years": experience_years,
        "experience_score": experience_score,
        "education": education,
        "education_score": education_score,
        "project_keywords": project_keywords,
        "project_score": project_score,
        "total_resume_score": total_score,
        "submission_time": submission_time
    }


def extract_text_from_pdf(pdf_url):
    response = requests.get(pdf_url)
    if response.status_code == 200:
        pdf_file = io.BytesIO(response.content)
        text = ''
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                load_text = page.extract_text() + "\n"
                text += re.sub(r'[^A-Za-z0-9.+]', " ", load_text.lower())
        return text
    else:
        print(f"Failed to fetch file from {pdf_url}")
        return None

def is_resume(text):
    keywords = ["experience", "education", "skills", "projects", "certifications", "summary", "objective"]
    found=sum(1 for words in keywords if words.lower() in text.lower())
    print(found,"found")
    return found >= 3

def extract_main_text(doc):
    tokens = [token.text for token in doc if re.search(r'[A-Za-z0-9]', token.text)]
    cleaned_tokens = [re.sub(r'[^A-Za-z+]', '', token).lower() for token in tokens]
    cleaned_skills = [re.sub(r'[^A-Za-z+]', '', skill).lower() for skill in SKILLS]
    matched_skills = [skill for token in cleaned_tokens for skill in cleaned_skills if  token == skill ]
    return list(set(matched_skills))

def extract_required_skills(job_skills):
    job_skills = list(job_skills.split(','))
    required_skills = [re.sub(r'[^A-Za-z+]', '', skill).lower() for skill in job_skills]
    return required_skills

def calculate_skill_match_score(matched_skills, required_skills):
    if not required_skills:
        return 0, []
    matched = set(matched_skills).intersection(set(required_skills))
    score = len(matched) / len(required_skills) * 100
    return round(score, 2), list(matched)

def extract_experience_years(text):
    pattern = r'(\d+)\+?\s+(years|year)\s+(of)?\s+experience'
    matches = re.findall(pattern, text)
    if matches:
        years = max([int(m[0]) for m in matches])
        return years
    return 0

def score_experience(actual_years, required_years):
    if required_years == 0:
        return 100
    score = min(100, (actual_years / required_years) * 100)
    return round(score, 2)


def extract_education(text):
   
    found = []
    for degree in EDUCATION:
        if degree in text:
            found.append(degree)
    return found

def score_education(found_degrees, required_degree):
    required_degree=list(required_degree.split(','))
    if not required_degree:
        return 100
    for degree in found_degrees:
        for require_degree in required_degree:
            if re.sub(r'[^A-Za-z]','',require_degree).lower() in re.sub(r'[^A-Za-z]','',degree):
                return 100
    return 0

def extract_projects(text):
    project_keywords = ['machine learning', 'deep learning', 'web app', 'chatbot', 'api', 'dashboard', 'flask', 'react']
    found = []
    for keyword in project_keywords:
        if keyword.lower() in text:
            found.append(keyword.lower())
    return list(set(found))

def score_projects(found_keywords, required_keywords):
    if not required_keywords:
        return 100
    required = [k.strip().lower() for k in required_keywords.split(',')]
    matched = set(found_keywords).intersection(set(required))
    return round(len(matched) / len(required) * 100, 2) if required else 0

def calculate_total_score(skill, exp, edu, proj):
    return round((skill * 0.4) + (exp * 0.2) + (edu * 0.2) + (proj * 0.2), 2)

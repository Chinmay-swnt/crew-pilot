import os
import sys
from pathlib import Path

# Ensure app modules can be imported
sys.path.append(str(Path(__file__).resolve().parent))

from supabase import create_client, Client
from app.core.config import settings, get_embeddings

def seed_crew_data():
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        raise ValueError("Supabase credentials missing from .env")

    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    embeddings_model = get_embeddings()

    print("1. Seeding roles table...")
    roles_data = [
        {"name": "sound engineer", "description": "Audio mixing and sound systems engineer"},
        {"name": "lighting tech", "description": "Stage lighting operator and DMX designer"}
    ]
    
    role_map = {}
    for r in roles_data:
        supabase.table("roles").upsert(r, on_conflict="name").execute()
        role_res = supabase.table("roles").select("id").eq("name", r["name"]).single().execute()
        role_map[r["name"]] = role_res.data["id"]

    print(f"Roles initialized: {role_map}")

    print("2. Generating embeddings and seeding crew members...")
    
    sample_crew = [
        {
            "id": 101,
            "name": "Rohan Mehta",
            "email": "rohan.m@example.com",
            "phone": "+919876543210",
            "role_name": "sound engineer",
            "location": "Mumbai",
            "experience_years": 8,
            "base_price": 45000.0,
            "base_rate": 45000.0,
            "rating": 4.9,
            "reliability": 0.98,
            "reliability_score": 0.98,
            "cancellations": 0,
            "successful_events": 45,
            "total_events": 45,
            "bio": "Senior Live Sound Engineer with 8+ years experience handling 500+ audience concerts, digital mixers, and stage acoustics in Mumbai."
        },
        {
            "id": 102,
            "name": "Aarav Sharma",
            "email": "aarav.s@example.com",
            "phone": "+919876543211",
            "role_name": "sound engineer",
            "location": "Mumbai",
            "experience_years": 5,
            "base_price": 35000.0,
            "base_rate": 35000.0,
            "rating": 4.7,
            "reliability": 0.95,
            "reliability_score": 0.95,
            "cancellations": 1,
            "successful_events": 20,
            "total_events": 21,
            "bio": "Acoustic technician and FOH sound engineer specializing in medium corporate events and live band performances."
        },
        {
            "id": 103,
            "name": "Priya Nair",
            "email": "priya.n@example.com",
            "phone": "+919876543212",
            "role_name": "lighting tech",
            "location": "Mumbai",
            "experience_years": 6,
            "base_price": 40000.0,
            "base_rate": 40000.0,
            "rating": 4.8,
            "reliability": 0.97,
            "reliability_score": 0.97,
            "cancellations": 0,
            "successful_events": 30,
            "total_events": 30,
            "bio": "Lead lighting technician & DMX designer for large-scale stage productions, moving heads, DMX consoles, and LED walls."
        },
        {
            "id": 104,
            "name": "Karan Verma",
            "email": "karan.v@example.com",
            "phone": "+919876543213",
            "role_name": "lighting tech",
            "location": "Mumbai",
            "experience_years": 3,
            "base_price": 30000.0,
            "base_rate": 30000.0,
            "rating": 4.5,
            "reliability": 0.92,
            "reliability_score": 0.92,
            "cancellations": 1,
            "successful_events": 12,
            "total_events": 13,
            "bio": "Event lighting assistant and spot operator skilled in rig installation, cabling, and basic DMX console operation."
        }
    ]

    for member in sample_crew:
        text_to_embed = f"Role: {member['role_name']}. Location: {member['location']}. Bio: {member['bio']}"
        embedding = embeddings_model.embed_query(text_to_embed)
        
        payload = {
            "id": member["id"],
            "name": member["name"],
            "email": member["email"],
            "phone": member["phone"],
            "role_id": role_map[member["role_name"]],
            "location": member["location"],
            "experience_years": member["experience_years"],
            "base_price": member["base_price"],
            "base_rate": member["base_rate"],
            "rating": member["rating"],
            "reliability": member["reliability"],
            "reliability_score": member["reliability_score"],
            "cancellations": member["cancellations"],
            "successful_events": member["successful_events"],
            "total_events": member["total_events"],
            "status": "ACTIVE",
            "bio": member["bio"],
            "embedding": embedding
        }

        supabase.table("crew_members").upsert(payload).execute()
        print(f"Seeded: {member['name']} (Role ID: {payload['role_id']})")

    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_crew_data()
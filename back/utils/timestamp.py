from datetime import datetime, timedelta
import random

def random_timestamp_after(start_timestamp, max_days=365):
    #Generate random timestamp up to 1 year after start
    
    if isinstance(start_timestamp, str):
        start = datetime.fromisoformat(start_timestamp)
    else:
        start = start_timestamp
    
    # Add random days (1 to 365 days later)
    random_days = random.randint(1, max_days)
    random_hours = random.randint(0, 23)
    random_minutes = random.choice([0, 30])
    
    new_timestamp = start + timedelta(
        days=random_days,
        hours=random_hours,
        minutes=random_minutes
    )
    
    return new_timestamp.isoformat()


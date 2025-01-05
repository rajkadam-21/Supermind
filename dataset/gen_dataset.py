import pandas as pd
import random
import uuid
from datetime import datetime, timedelta


post_types = ['carousel', 'reels', 'static']
weights = {"likes": 0.4, "shares": 0.3, "comments": 0.3} 
start_date = datetime(2023, 1, 1)  


data = []

for _ in range(400):
    post_id = str(uuid.uuid4())  
    post_type = random.choice(post_types)
    likes = random.randint(50, 1000)  
    shares = random.randint(5, 100)  
    comments = random.randint(2, 200)  
    post_date = start_date + timedelta(days=random.randint(0, 365))  
    
  
    engagement_weight = round(
        (likes * weights["likes"]) + 
        (shares * weights["shares"]) + 
        (comments * weights["comments"]), 2
    )
    
    
    data.append({
        "post_id": post_id,
        "type": post_type,
        "likes": likes,
        "shares": shares,
        "comments": comments,
        "engagement_weight": engagement_weight,
        "post_date": post_date.strftime("%Y-%m-%d")
    })


df = pd.DataFrame(data)


df.to_csv('social_media_engagement_with_uuid_and_date.csv', index=False)

print("Dataset generated and saved as 'social_media_engagement_with_uuid_and_date.csv'.")
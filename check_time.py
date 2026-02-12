import datetime
import sys

def check_hackathon_status():
    # Hackathon start: Feb 12, 11:30 AM (Approx based on user input)
    # 5-hour mark: Feb 12, 4:30 PM
    
    now = datetime.datetime.now()
    start_time = now.replace(hour=11, minute=30, second=0, microsecond=0)
    
    # If it's before 11:30 AM, maybe it's the next day or we need to adjust, 
    # but let's assume same day for simple logic or handle day rollover.
    # Actually, simpler logic: just print current time and the rule.
    
    five_hour_mark = start_time + datetime.timedelta(hours=5)
    
    print(f"Current Time: {now.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"5-Hour Mark:  {five_hour_mark.strftime('%Y-%m-%d %H:%M:%S')}")
    
    if now < five_hour_mark:
        print("\n[STATUS] We are in the first 5 hours.")
        print("You don't *have* to commit every hour yet, but it's good practice!")
    else:
        print("\n[URGENT] We are past the 5-hour mark.")
        print("RULE ACTIVE: You MUST commit code at least once every 60 minutes.")

if __name__ == "__main__":
    check_hackathon_status()

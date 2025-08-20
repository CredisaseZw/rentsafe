import re
import datetime
from django.core.exceptions import ValidationError


def validate_national_id(national_id, country: str) -> bool:
    patterns = {
        "zimbabwe": r'\d{8}[a-zA-Z]\d{2}$',
        "south_africa": r'^\d{13}$',
        "namibia": r'^\d{13}$',
        "botswana": r'^\d{13}$',
        "lesotho": r'^\d{13}$',
        "zambia": r'^\d{6}/\d{2}/\d{1}$',
        "malawi": r'^\d{2}-?\d{6}-?[A-Z]-?\d{2}$',
        
    }

    country_key = country.strip().lower().replace(" ", "")

    pattern = patterns.get(country_key)

    if not pattern:
        raise ValueError(f"No national ID validation pattern for {country}")
    
    national_id_clean = national_id.strip().upper().replace(" ", "").replace("-","")

    return bool(re.match(pattern, national_id_clean))
    
def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern,email))


def normalize_zimbabwe_mobile(phone):  
    phone = re.sub(r'[\s-]', '', phone.strip())  
    for prefix in ['00263', '+263', '263']:  
        if phone.startswith(prefix):  
            phone = phone[len(prefix):]  
            break  
    if phone.startswith('0'):  
        phone = phone[1:]  
    if re.match(r'^(77|78|71|73)\d{7}$', phone):  
        return f'+263{phone}'  
    return None  

def validate_future_dates(date):
    return date > datetime.date.today()

import re
from django.core.exceptions import ValidationError

# def validate_national_id(id_number: str) -> bool:
#     pattern = r'\d{8,9}[a-zA-Z]+\d{2}'
#     return re.match(pattern, id_number)

# def validate_passport_number(passport_number: str) -> bool:
#     pattern=  r'^[A-Z]{2}\d{6,7}$'
#     if not passport_number:
#         return False

#     passport_number = passport_number.strip().upper()
    
#     return bool(re.match(pattern, passport_number))

def validate_national_id(national_id, country):
    patterns = {
        "zimbabwe": r'\d{8,9}[a-zA-Z]+\d{2}',
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
    
    national_id_clean = national_id.strip().upper()

    if not re.match(pattern, national_id_clean):
        raise ValidationError(f"Invalid national ID for {country}: {national_id_clean}")


def validate_phone_number(phone_number, country):
    patterns = {
        "zimbabwe": r'^(?:\+263|00263|0)?(7[1-9]\d{7}|24\d{7})$',
        "south_africa": r'^(?:\+27|0027|0)?(6|7|8)\d{8}$',
        "zambia": r'^(?:\+260|00260|0)?(9[5-9]\d{7})$',
        "malawi": r'^(?:\+265|00265)?(99|88|77)\d{6}$', 
        "namibia": r'^(?:\+264|00264|0)?(81|82|85|86)\d{7}$',
        "mozambique": r'^(?:\+258|00258|0)?(8[2-7]\d{7})$',
        "botswana": r'^(?:\+267|00267|0)?(7[1-9]\d{6})$',
        "lesotho": r'^(?:\+266|00266|0)?(5[6-8]\d{6})$',
        "angola": r'^(?:\+244|00244|0)?(9[1-9]\d{7})$'
    }

    country_key = country.strip().lower().replace(" ", "")

    pattern = patterns.get(country_key)

    if not pattern:
        raise ValueError(f"No phone validation pattern for {country}")
    
    if not re.match(pattern, phone_number):
        
        raise ValidationError(f"Invalid phone number for {country}: {phone_number}")


def validate_passport_number(passport_number, country):
    patterns = {
        "zimbabwe": r'^[A-Z]{2}\d{6}$',
        "south_africa": r'^\d{9}$',
        "zambia": r'^[A-Z]{2}\d{7}$',
        "malawi": r'^[A-Z]{2}\d{7}$',
        "namibia": r'^N\d{8}$',
        "mozambique": r'^[A-Z]{2}\d{7}$',
        "botswana": r'^BN\d{7}$',
        "lesotho": r'^LS\d{7}$',
        "angola": r'^\d{9}$'
    }

    country_key = country.strip().lower().replace(" ", "")

    pattern = patterns.get(country_key)

    if not pattern:
        raise ValueError(f"No passport validation pattern for {country}")
    
    passport_number = passport_number.strip().upper()

    if not re.match(pattern, passport_number):
        raise ValidationError(f"Invalid passport number for {country}: {passport_number}")
    
def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern,email):
        raise ValueError("Invalid email address")

# def validate_zimbabwean_phone(phone):  
#     # Step 1: Clean input  
#     cleaned = re.sub(r'[+\s-]', '', phone)  

#     # Step 2: Validate  
#     if cleaned.startswith('07') and len(cleaned) == 10:  
#         if cleaned[2] in ['7', '1', '8', '3']:  
#             return True  
#     elif cleaned.startswith('2637') and len(cleaned) == 12:  
#         if cleaned[4] in ['7', '1', '8', '3']:  
#             return True  
#     return False  
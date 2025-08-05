import re
from django.core.exceptions import ValidationError


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
    
    national_id_clean = national_id.strip().upper().replace(" ", "").replace("-","")

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
    
def validate_email(email: str)-> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern,email)


def normalize_zimbabwe_mobile(phone):
    phone = phone.strip().replace(" ", "").replace("-", "")
    if phone.startswith("+"):
        phone = phone[1:]
    if phone.startswith("0"):
        phone = phone[1:]
    if phone.startswith("263"):
        phone = phone[3:]
    if re.match(r"^7\d{8}$", phone):
        return f"+263{phone}"
    return None
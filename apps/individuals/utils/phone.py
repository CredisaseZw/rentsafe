import re

def normalize_phone_number(phone, country="zimbabwe"):
    phone = re.sub(r'\D', '', phone) 

    if country.lower() == "zimbabwe":
        if phone.startswith("0"):
            phone = phone[1:]
        if not phone.startswith("263"):
            phone = f"263{phone}"
        return f"+{phone}"
    return phone

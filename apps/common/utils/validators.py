import re
import datetime
from django.core.exceptions import ValidationError
from django.core.validators import validate_email as django_validate_email


def validate_national_id(national_id, country: str = "zimbabwe") -> bool:
    patterns = {
        "zimbabwe": r"^\d{8,9}[a-zA-Z]\d{2}$",
        "angola": r"^\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{7}$",
        "south_africa": r"^\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{7}$",
        "namibia": r"^\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{7}$",
        "botswana": r"^\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{7}$",
        "lesotho": r"^\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{7}$",
        "zambia": r"^\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}$",
        "malawi": r"^\d{8}[A-Z]\d{2}$",
        "mozambique": r"^(?:\d{12}|[A-Z]{2}\d{12})$",
    }

    country_key = country.strip().lower().replace(" ", "").replace("-", "")

    pattern = patterns.get(country_key)

    if not pattern:
        raise ValueError(f"No national ID validation pattern for {country}")

    national_id_clean = (
        national_id.strip().upper().replace(" ", "").replace("-", "").replace("/", "")
    )

    return bool(re.match(pattern, national_id_clean))


def validate_email(email: str) -> bool:
    try:
        django_validate_email(email)
        return True
    except ValidationError:
        return False


def normalize_zimbabwe_mobile(phone, type="mobile"):
    phone = re.sub(r"[\s-]", "", phone.strip())
    if re.match(r"^(?:.*?)(77|78|71|73)\d{7}$", phone):
        if type in ["mobile", "whatsapp", "combined", "other"]:
            phone = phone[-9:]
        return f"+263{phone}"
    return False


def validate_future_dates(date):
    today = datetime.date.today()
    if date > today:
        return False
    age = today.year - date.year - ((today.month, today.day) < (date.month, date.day))
    return age >= 18

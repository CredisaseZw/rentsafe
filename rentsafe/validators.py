"""
Define custom field validators.
"""
import re


def validate_national_id(id_number: str) -> bool:
    pattern = r'\d{8,9}[a-zA-Z]+\d{2}'
    return re.match(pattern, id_number)

def validate_passport_number(passport_number):
    return True
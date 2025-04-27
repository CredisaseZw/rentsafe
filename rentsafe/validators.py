"""
Define custom field validators.
"""
import re


def validate_national_id(id_number: str) -> bool:
    pattern = r'\d{8,9}[a-zA-Z]+\d{2}'
    return re.match(pattern, id_number)

def validate_passport_number(passport_number):
    return True
def validate_phone_number(phone_number):
    pattern = r'^(0(71|77|78|73)\d{7}|263(71|77|78|73)\d{7})$'
    return re.match(pattern, phone_number)
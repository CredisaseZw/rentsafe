from rest_framework.exceptions import ValidationError

def extract_error_message(error):
    """
    Extracts the first error message string from a DRF ValidationError or other exception.
    """
    if isinstance(error, ValidationError):
        detail = error.detail

        if isinstance(detail, list):
            return str(detail[0])

        elif isinstance(detail, dict):
            for key, value in detail.items():
                return str(value[0]) if isinstance(value, list) and value else str(value)
        else:
            return str(detail)
    return str(error)
# apps/credit_control/models/__init__.py
from .debt_collection import (
    DebtCase as _DebtCase,
    PaymentPlan as _PaymentPlan, 
    CommunicationLog as _CommunicationLog
)

DebtCase = _DebtCase
PaymentPlan = _PaymentPlan
CommunicationLog = _CommunicationLog

__all__ = ['DebtCase', 'PaymentPlan', 'CommunicationLog']
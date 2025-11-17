"""Views for Credit Notes in the Accounting app."""

from apps.accounting.api.serializers.credit_notes_serializers import (
    CreditNoteSerializer,
)
from apps.accounting.api.views.views import BaseCompanyViewSet
from apps.accounting.filters.filters import CreditNoteFilter
from apps.accounting.models.models import CreditNote


class CreditNoteViewSet(BaseCompanyViewSet):
    queryset = CreditNote.objects.all()
    serializer_class = CreditNoteSerializer
    filterset_class = CreditNoteFilter

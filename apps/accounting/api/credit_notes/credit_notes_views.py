# """Views for Credit Notes in the Accounting app."""

# import logging
# from apps.accounting.api.credit_notes.credit_notes_serializers import (
#     CreditNoteSerializer,
# )
# from apps.accounting.api.views.views import BaseCompanyViewSet
# from apps.accounting.filters.filters import CreditNoteFilter
# from apps.accounting.models.models import CreditNote

# logger = logging.getLogger("accounting")


# class CreditNoteViewSet(BaseCompanyViewSet):
#     """ViewSet for managing Credit Notes."""

#     queryset = CreditNote.objects.all()
#     serializer_class = CreditNoteSerializer
#     filterset_class = CreditNoteFilter

from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action

from datetime import date

from apps.common.utils.helpers import extract_error_message
from apps.common.api.views import BaseViewSet
from apps.individuals.api.serializers import IndividualClaimSerializer
from apps.legal.models import Claim
from apps.legal.api.serializers.claim_serializers import ClaimCreateSerializer, ClaimMinimalSerializer, ClaimSerializer
import logging

logger = logging.getLogger('legal')


"""API views for Claim management.

This module exposes a DRF ViewSet with endpoints to create, update,
retrieve and perform claim-specific actions such as verify/close and
retrieving claims by debtor (individual or company branch).

Each action uses concise responses via BaseViewSet._create_rendered_response.
"""


class ClaimViewSet(BaseViewSet):
    """ViewSet for Claim operations.

    Exposes standard CRUD for claims and a few custom actions:
    - GET /.../individual/    -> claims for an individual debtor
    - GET /.../company/       -> claims for a company branch debtor
    - POST /.../autocreate_claims/ -> create claim(s) from leases (dev helper)
    - PATCH /.../{pk}/verify/ -> mark a claim verified
    - PATCH /.../{pk}/close/  -> mark a claim closed
    - GET /.../un-verified/   -> list unverified claims
    - PATCH /.../{pk}/verify-claims/ -> verify multiple claims for a debtor
    """

    queryset = Claim.objects.all()
    serializer_class = ClaimCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return the base queryset with common related joins to avoid N+1 queries."""
        return Claim.objects.all().select_related('client', 'currency', 'debtor_content_type')
    
    def get_serializer_class(self):
        """Choose serializer class depending on action (create/retrieve/list)."""
        if self.action in ['create', 'update', 'partial_update']:
            return ClaimCreateSerializer
        elif self.action in ['retrieve']:
            return ClaimSerializer
        elif self.action in ['un-verified', 'list']:
            return ClaimMinimalSerializer

    def create(self, request, *args, **kwargs):
        """Create a new Claim from request data.

        Validates input and returns the created claim payload or a
        400/500 error response using the project's helper response format.
        """
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return self._create_rendered_response(serializer.data, status_code=201)
        
        except ValidationError as ve:
            # Return user-facing validation error message
            return self._create_rendered_response(
                {"error": extract_error_message(ve)}, 
                status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            # Log unexpected server errors and return generic message
            logger.error(f"Error creating claim: {str(e)}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, 
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def update(self, request, *args, **kwargs):
        """Update an existing Claim (full or partial).

        The partial flag allows patch-like updates when provided.
        """
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return self._create_rendered_response(serializer.data,status.HTTP_200_OK)
        
        except ValidationError as ve:
            return self._create_rendered_response(
                {"error": extract_error_message(ve)}, 
                status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error updating claim: {extract_error_message(e)}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, 
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'], url_path='individual')
    def get_individual_claims(self, request, pk=None):
        """Return minimal claim records for an individual debtor (by pk)."""
        try:
            individual_claims = self.get_queryset().filter(
                debtor_content_type__model='individual',
                debtor_object_id=pk
            ).select_related('client', 'currency', 'debtor_content_type')

            serializer = ClaimMinimalSerializer(individual_claims, many=True)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error retrieving claims for individual {pk}: {extract_error_message(e)}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, 
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    @action(detail=True, methods=['get'], url_path='company')
    def get_company_claims(self, request, pk=None):
        """Return minimal claim records for a company branch debtor (by pk)."""

        try:
            company_branch_claims = Claim.objects.filter(
                debtor_content_type__model='companybranch',
                debtor_object_id=pk
            ).select_related('client', 'currency', 'debtor_content_type')
            serializer = ClaimMinimalSerializer(company_branch_claims, many=True)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error retrieving claims for company branch {pk}: {extract_error_message(e)}")
            return self._create_rendered_response(
                {"Something went wrong"}, 
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['POST'], url_path='autocreate_claims')
    def auto_create_claims(self, request, pk=None):
        """Development helper: create claims automatically from overdue leases.

        This endpoint is intended for internal/dev use and will attempt to
        generate a claim for a hard-coded lease in the current implementation.
        """
        try:
            from apps.legal.utils.lease_claims_helper import create_claim_from_lease
            claim = create_claim_from_lease(lease="LSE-2509-0008")
            if claim:
                serializer = ClaimSerializer(claim)
                return self._create_rendered_response(serializer.data, status.HTTP_201_CREATED)
            else:
                return self._create_rendered_response(
                    {"message": "No active overdue leases found."}, 
                    status.HTTP_404_NOT_FOUND
                )
        
        except Exception as e:
            logger.error(f"Error auto-creating claims for individual: {extract_error_message(e)}")
            return self._create_rendered_response(
                {"error": "Something went wrong"}, 
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['PATCH'], url_path='verify')
    def verify_claim(self, request, pk=None):
        """Mark a single claim as verified by the requesting user."""
        try:
            claim = self.get_object()
            data = {
                'is_verified': True,
                'verified_by': request.user.pk,
                'verified_date': date.today()
            }
            serializer = ClaimCreateSerializer(instance=claim, data=data, partial=True, context={'request': request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error verifying claim {pk}: {extract_error_message(e)}")
            return self._create_rendered_response(
                {"Something went wrong"}, 
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['PATCH'], url_path='close')
    def close_claim(self, request, pk=None):
        """Mark a single claim as closed by the requesting user."""
        try:
            claim = self.get_object()
            data = {
                'is_closed': True,
                'closed_by': request.user.pk,
                'closed_date': date.today()
            }
            serializer = ClaimCreateSerializer(instance=claim, data=data, partial=True, context={'request': request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error closing claim {pk}: {extract_error_message(e)}")
            return self._create_rendered_response(
                {"Something went wrong"}, 
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], url_path='un-verified')
    def get_unverified_claims(self, request, pk=None):
        """Return a list of claims that are not yet verified."""
        try:
            unverified_claims = self.get_queryset().filter(
                is_verified=False
            ).select_related('client', 'currency', 'debtor_content_type')

            serializer = self.get_serializer(unverified_claims, many=True)
            return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Error retrieving unverified claims: {extract_error_message(e)}")
            return self._create_rendered_response(      
                {"error": "Something went wrong"},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['patch'], url_path='verify-claims')
    def verify_claims(self, request, pk=None):
        """Verify one or more claims for a debtor.

        Query params:
        - type: 'individual' or 'company' (required)
        - claim_id: optional, limit verification to a single claim id if not provided verifies all unverified claims for debtor
        - pk: debtor object id (from URL)
        """
        try:
            debtor_type = request.query_params.get('type')
            claim_id = request.query_params.get('claim_id')

            if debtor_type not in ['individual', 'company']:
                return self._create_rendered_response(
                    {"error": "Invalid or missing 'type' query parameter. Must be 'individual' or 'company'."},
                    status.HTTP_400_BAD_REQUEST
                )

            model_map = {
                'individual': 'individual',
                'company': 'companybranch'
            }

            base_qs = self.get_queryset().filter(
                debtor_content_type__model=model_map[debtor_type],
                debtor_object_id=pk,
                is_verified=False,
                is_closed=False
            )

            qs = base_qs.filter(id=claim_id) if claim_id else base_qs

            if not qs.exists():
                return self._create_rendered_response(
                    {"message": "No matching opened claims found."},
                    status.HTTP_404_NOT_FOUND
                )

            verified = []
            for claim in qs:
                data = {
                    'is_verified': True,
                    'verified_by': request.user.pk,
                    'verified_date': date.today()
                }
                serializer = ClaimCreateSerializer(
                    instance=claim,
                    data=data,
                    partial=True,
                    context={'request': request}
                )
                serializer.is_valid(raise_exception=True)
                serializer.save()
                verified.append(serializer.data)

            return self._create_rendered_response(verified, status.HTTP_200_OK)

        except ValidationError as ve:
            return self._create_rendered_response(
                {"error": extract_error_message(ve)},
                status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error verifying claims for debtor {pk}: {extract_error_message(e)}")
            return self._create_rendered_response(
                {"Something went wrong"},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['patch'], url_path='close-claims')
    def close_claims(self, request, pk=None):
        """Close one or more claims for a debtor.

        Query params:
        - type: 'individual' or 'company' (required)
        - claim_id: optional, limit closing to a single claim id if not provided closes all unclosed claims for debtor
        - pk: debtor object id (from URL)
        """
        try:
            debtor_type = request.query_params.get('type')
            claim_id = request.query_params.get('claim_id')

            if debtor_type not in ['individual', 'company']:
                return self._create_rendered_response(
                    {"error": "Invalid or missing 'type' query parameter. Must be 'individual' or 'company'."},
                    status.HTTP_400_BAD_REQUEST
                )

            model_map = {
                'individual': 'individual',
                'company': 'companybranch'
            }

            base_qs = self.get_queryset().filter(
                debtor_content_type__model=model_map[debtor_type],
                debtor_object_id=pk,
                is_closed=False
            )

            qs = base_qs.filter(id=claim_id) if claim_id else base_qs

            if not qs.exists():
                return self._create_rendered_response(
                    {"message": "No matching opened claims found."},
                    status.HTTP_404_NOT_FOUND
                )

            closed = []
            for claim in qs:
                data = {
                    'is_closed': True,
                    'closed_by': request.user.pk,
                    'closed_date': date.today()
                }
                serializer = ClaimCreateSerializer(
                    instance=claim,
                    data=data,
                    partial=True,
                    context={'request': request}
                )
                serializer.is_valid(raise_exception=True)
                serializer.save()
                closed.append(serializer.data)

            return self._create_rendered_response(closed, status.HTTP_200_OK)

        except ValidationError as ve:
            return self._create_rendered_response(
                {"error": extract_error_message(ve)},
                status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error closing claims for debtor {pk}: {extract_error_message(e)}")
            return self._create_rendered_response(
                {"Something went wrong"},
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['patch'], url_path='bulk-verify')
    def bulk_verify_claims(self, request, pk=None):
        """Verify *ALL* pending claims in the system."""
        pending_claims = self.get_queryset().filter(is_verified=False)
        if not pending_claims.exists():
            return self._create_rendered_response(
                {"message": "No pending claims to verify."},
                status.HTTP_404_NOT_FOUND
            )
        verified = 0
        failed = 0
        for claim in pending_claims:
            data = {
                'is_verified': True,
                'verified_by': request.user.pk,
                'verified_date': date.today()
            }
            serializer = ClaimCreateSerializer(
                instance=claim,
                data=data,
                partial=True,
                context={'request': request}
            )
            try:
                serializer.is_valid(raise_exception=True)
                serializer.save()
                verified += 1
            except ValidationError as ve:
                failed += 1
                logger.error(f"Validation error verifying claim {claim.id}: {extract_error_message(ve)}")
            except Exception as e:
                failed += 1
                logger.error(f"Error verifying claim {claim.id}: {extract_error_message(e)}")
        return self._create_rendered_response(
            {"message": f"Verified {verified} claims. \n Failed to verify {failed} claims."},
            status.HTTP_200_OK
        )

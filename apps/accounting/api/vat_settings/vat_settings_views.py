# """Views for VAT settings management."""

# import logging
# from django.http import Http404
# from rest_framework import status
# from rest_framework.exceptions import ValidationError
# from django.db.models import Q
# from apps.common.utils.helpers import extract_error_message
# from apps.accounting.api.vat_settings.vat_settings_serializers import (
#     VATSettingSerializer,
# )
# from apps.accounting.models.models import VATSetting
# from apps.common.api.views import BaseViewSet

# logger = logging.getLogger("accounting")


# class VATSettingViewSet(BaseViewSet):
#     """ViewSet for managing VAT settings.

#     Allows creation, retrieval, updating, and deletion of VAT settings.
#     Ensures that VAT settings are unique per company based on description.

#     """

#     queryset = VATSetting.objects.all().order_by("-id")
#     serializer_class = VATSettingSerializer

#     def get_queryset(self):
#         return self.queryset.filter(
#             Q(created_by__client=self.request.user.client) | Q(created_by__isnull=True)
#         )

#     def create(self, request, *args, **kwargs):
#         data = request.data
#         invalid_data = []
#         valid_data = []
#         try:
#             for item in data:
#                 serializer = self.get_serializer(data=item)
#                 if serializer.is_valid():
#                     serializer.save()
#                     valid_data.append(serializer.data)
#                 else:
#                     invalid_data.append(extract_error_message(serializer.errors))

#             if invalid_data and valid_data:
#                 return self._create_rendered_response(
#                     {"created": valid_data, "errors": invalid_data},
#                     status.HTTP_207_MULTI_STATUS,
#                 )
#             elif not invalid_data:
#                 return self._create_rendered_response(
#                     valid_data, status.HTTP_201_CREATED
#                 )
#             elif not valid_data:
#                 return self._create_rendered_response(
#                     {"errors": invalid_data}, status.HTTP_400_BAD_REQUEST
#                 )

#         except ValidationError as e:
#             logger.error(f"Validation error creating VAT setting: {e}")
#             return self._create_rendered_response(
#                 {"error": extract_error_message(e)},
#                 status.HTTP_400_BAD_REQUEST,
#             )
#         except Exception as e:
#             logger.error(f"Error creating VAT setting: {e}")
#             return self._create_rendered_response(
#                 {"error": "Something went wrong"},
#                 status.HTTP_500_INTERNAL_SERVER_ERROR,
#             )

#     def retrieve(self, request, *args, **kwargs):
#         try:
#             instance = self.get_object()
#             serializer = self.get_serializer(instance)
#             return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
#         except Exception as e:
#             logger.error(f"Error retrieving VAT setting: {e}")
#             return self._create_rendered_response(
#                 {"error": "Something went wrong"},
#                 status.HTTP_500_INTERNAL_SERVER_ERROR,
#             )

#     def list(self, request, *args, **kwargs):
#         try:
#             vat = self.get_queryset()
#             page = self.paginate_queryset(vat)
#             if page is not None:
#                 serializer = self.get_serializer(page, many=True)
#                 return self.get_paginated_response(serializer.data)
#             serializer = self.get_serializer(vat, many=True)
#             return self._create_rendered_response(serializer.data, status.HTTP_200_OK)
#         except Exception as e:
#             logger.error(f"Error retrieving VAT settings: {e}")
#             return self._create_rendered_response(
#                 {"error": "Something went wrong"},
#                 status.HTTP_500_INTERNAL_SERVER_ERROR,
#             )

#     def update(self, request, *args, **kwargs):
#         try:
#             partial = kwargs.pop("partial", False)
#             instance = self.get_object()
#             if instance.created_by is None:
#                 return self._create_rendered_response(
#                     {"error": "This VAT cannot be modified."},
#                     status.HTTP_403_FORBIDDEN,
#                 )
#             serializer = self.get_serializer(
#                 instance, data=request.data, partial=partial
#             )
#             serializer.is_valid(raise_exception=True)
#             self.perform_update(serializer)
#             return self._create_rendered_response(serializer.data, status.HTTP_200_OK)

#         except ValidationError as e:
#             logger.error(f"Validation error updating VAT setting: {e}")
#             return self._create_rendered_response(
#                 {"error": extract_error_message(e)},
#                 status.HTTP_400_BAD_REQUEST,
#             )
#         except Exception as e:
#             logger.error(f"Error updating VAT setting: {e}")
#             return self._create_rendered_response(
#                 {"error": "Something went wrong"},
#                 status.HTTP_500_INTERNAL_SERVER_ERROR,
#             )

#     def destroy(self, request, *args, **kwargs):
#         try:
#             instance = self.get_object()
#             if instance.created_by is None:
#                 return self._create_rendered_response(
#                     {"error": "You do not have permission to delete this VAT setting."},
#                     status.HTTP_403_FORBIDDEN,
#                 )
#             self.perform_destroy(instance)
#             return self._create_rendered_response(
#                 {"success": "VAT setting deleted successfully"},
#                 status.HTTP_204_NO_CONTENT,
#             )

#         except Http404:
#             return self._create_rendered_response(
#                 {"error": "VAT not found"},
#                 status.HTTP_404_NOT_FOUND,
#             )
#         except Exception as e:
#             logger.error(f"Error deleting VAT setting: {e}")
#             return self._create_rendered_response(
#                 {"error": "Something went wrong"},
#                 status.HTTP_500_INTERNAL_SERVER_ERROR,
#             )

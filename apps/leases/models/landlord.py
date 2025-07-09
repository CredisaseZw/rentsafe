from django.db.models import Q
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from common.models.base_models import BaseModel

class Landlord(BaseModel):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE,
                                    limit_choices_to=Q(app_label='individuals', model='individual') | Q(app_label='companies', model='companybranch'))
    object_id = models.PositiveIntegerField(null=True, blank=True)
    landlord_object = GenericForeignKey('content_type', 'object_id')
    def __str__(self):
        return f"Landlord: {self.landlord_object}"

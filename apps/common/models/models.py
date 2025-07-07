from django.db import models

# Create your models here.
from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils.text import slugify
from common.models.base_models import BaseModel

class Document(models.Model):
    DOCUMENT_TYPES = (
        ('id', 'Identification'),
        ('proof_of_address', 'Proof of Address'),
        ('contract', 'Contract'),
        ('other', 'Other'),
    )
    
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='documents/')
    description = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.get_document_type_display()} for {self.content_object}"

class Note(BaseModel):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    author = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    content = models.TextField()
    is_private = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Note by {self.author} on {self.content_object}"




class Country(BaseModel):
    """Country level location data"""

    name = models.CharField(max_length=100)
    code = models.CharField(max_length=3)  # ISO 3166-3 alpha-3
    slug = models.SlugField(unique=True, null=True)
    dial_code = models.CharField(max_length=5)
    currency_code = models.CharField(max_length=3)
    currency_name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "countries"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if not self.id:
            count = 1
            while Country.objects.filter(slug=self.slug).exists():
                self.slug = f"{self.slug}-{count}"
                count += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.code})"


class Province(BaseModel):
    """Provinces/States level location data"""

    country = models.ForeignKey(
        Country, on_delete=models.PROTECT, related_name="provinces"
    )
    slug = models.SlugField(unique=True, null=True)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10)
    is_active = models.BooleanField(default=True)
    approved = models.BooleanField(default=False)

    class Meta:
        unique_together = ["country", "code"]
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        
        if not self.id:
            count = 1
            while Province.objects.filter(slug=self.slug).exists():
                self.slug = f"{self.slug}-{count}"
                count += 1
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.code}) - {self.country.name}"


class City(BaseModel):
    """City/Town level location data"""

    province = models.ForeignKey(
        Province, on_delete=models.PROTECT, related_name="cities"
    )
    slug = models.SlugField(unique=True, null=True)
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "cities"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        
        if not self.id:
            count = 1
            while City.objects.filter(slug=self.slug).exists():
                self.slug = f"{self.slug}-{count}"
                count += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.province.name}"


class Suburb(BaseModel):
    """Suburb level location data"""

    city = models.ForeignKey(City, on_delete=models.PROTECT, related_name="suburbs")
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        
        if not self.id:
            count = 1
            while Suburb.objects.filter(slug=self.slug).exists():
                self.slug = f"{self.slug}-{count}"
                count += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.city.name}"


class Address(BaseModel):
    ADDRESS_TYPES = (
        ('physical', 'Physical Address'),
        ('postal', 'Postal Address'),
        ('billing', 'Billing Address'),
        ('work', 'Work Address'),
        ('other', 'Other'),
    )

    # Generic Foreign Key to link Address to our other models (eg Individual, Company, Property, etc.)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    # Type of address for the linked object
    address_type = models.CharField(max_length=20, choices=ADDRESS_TYPES, default='physical')
    is_primary = models.BooleanField(default=False, help_text="Is this the primary address of its type for the linked object?")

    country = models.ForeignKey(Country, on_delete=models.PROTECT, related_name="addresses", null=True, blank=True)
    province = models.ForeignKey(Province, on_delete=models.PROTECT, related_name="addresses", null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.PROTECT, related_name="addresses")
    suburb = models.ForeignKey(Suburb, on_delete=models.PROTECT, related_name="addresses", null=True, blank=True)

    # Address Components 
    street_address = models.CharField(max_length=255, help_text="Street name, house/building number", null=True, blank=True)
    line_2 = models.CharField(max_length=255, blank=True, null=True, help_text="Apartment, suite, or unit number")
    postal_code = models.CharField(max_length=20, null=True, blank=True)

    # Geographic coordinates
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    class Meta:
        verbose_name_plural = "Addresses"
        # Ensure only one primary address of a given type per object
        unique_together = ('content_type', 'object_id', 'address_type', 'is_primary')
        ordering = ["city", "suburb", "street_address", "address_type"]

    def __str__(self):
        parts = []
        if self.street_address:
            parts.append(self.street_address)
        if self.line_2:
            parts.append(self.line_2)
        if self.suburb:
            parts.append(self.suburb.name)
        if self.city:
            parts.append(self.city.name)
        if self.province and self.province.name != self.city.name:
            parts.append(self.province.name)
        if self.country:
            parts.append(self.country.name)
        if self.postal_code:
            parts.append(self.postal_code)

        if not parts:
            return f"Address (ID: {self.pk})"

        return f"{', '.join(parts)} ({self.get_address_type_display()})"

    def save(self, *args, **kwargs):
        if self.city and not self.province:
            self.province = self.city.province
        if self.province and not self.country:
            self.country = self.province.country

        if self.is_primary and self.content_object:
            qs = Address.objects.filter(
                content_type=self.content_type,
                object_id=self.object_id,
                address_type=self.address_type,
                is_primary=True
            )
            if self.pk: 
                qs = qs.exclude(pk=self.pk)
            qs.update(is_primary=False)

        super().save(*args, **kwargs)
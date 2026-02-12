from django.db.models import Q
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from apps.common.models.base_models import BaseModel
from apps.companies.models.models import CompanyBranch, CompanyProfile
from apps.individuals.models.models import (
    Individual,
    IndividualAccounts,
    IndividualContactDetail,
)
from apps.properties.models import Property


class Landlord(BaseModel):
    landlord_name = models.CharField(max_length=255)
    landlord_type = models.CharField(
        max_length=100,
        choices=[
            ("individual", "Individual"),
            ("company", "Company"),
        ],
    )
    landlord_id = models.CharField(max_length=100, blank=True, null=True)
    properties = models.ManyToManyField(Property, related_name="landlords")

    class Meta:
        app_label = "leases"
        db_table = "landlord"
        verbose_name = "Landlord"
        verbose_name_plural = "Landlords"
        ordering = ["-date_created"]

    def __str__(self):
        return f"Landlord: {self.landlord_name}" if self.landlord_name else None

    @property
    def full_name(self):
        """Return the full name of the landlord based on type."""
        if self.landlord_type == "individual":
            individual = Individual.objects.filter(pk=self.landlord_id).first()
            if individual:
                return individual.full_name
        else:
            company = CompanyBranch.objects.filter(company=self.landlord_id).first()
            if company:
                return company.full_name
        return self.landlord_name

    @property
    def phone_number(self):
        phone = None
        if self.landlord_type == "individual":
            queryset = IndividualContactDetail.objects.filter(
                individual=self.landlord_id
            )
            if queryset.exists():
                phone = queryset.last().mobile_number
        else:
            queryset = CompanyBranch.objects.filter(company=self.landlord_id)
            if queryset.exists():
                phone = queryset.last().phone

        return phone

    @property
    def email(self):
        email = None
        if self.landlord_type == "individual":
            queryset = Individual.objects.filter(individual=self.landlord_id)
            if queryset.exists():
                email = queryset.last().email
        else:
            queryset = CompanyBranch.objects.filter(company=self.landlord_id)
            if queryset.exists():
                email = queryset.last().email

        return email

    @property
    def address(self):
        if self.landlord_type == "individual":
            individual = Individual.objects.filter(pk=self.landlord_id).first()
            return individual.primary_address if individual else None

        branch = (
            CompanyBranch.objects.filter(company=self.landlord_id)
            # .order_by("-is_headquarters", "-id")
            .first()
        )
        return branch.primary_address if branch else None

    @property
    def tin_number(self):
        if self.landlord_type == "individual":
            return (
                IndividualAccounts.objects.filter(individual_id=self.landlord_id)
                # .order_by("-id")
                .values_list("tin_number", flat=True).first()
            )

        return (
            CompanyProfile.objects.filter(company_id=self.landlord_id)
            # .order_by("-id")
            .values_list("tin_number", flat=True).first()
        )

    @property
    def vat_number(self):
        if self.landlord_type == "individual":
            return (
                IndividualAccounts.objects.filter(individual_id=self.landlord_id)
                # .order_by("-id")
                .values_list("vat_number", flat=True).first()
            )

        return (
            CompanyProfile.objects.filter(company_id=self.landlord_id)
            # .order_by("-id")
            .values_list("vat_number", flat=True).first()
        )
